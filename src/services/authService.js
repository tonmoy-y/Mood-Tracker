import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { ADMIN_EMAILS, USER_ROLES, USER_STATUS } from '../constants/app'
import { auth, db } from '../firebase/config'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const normalizeEmail = (email = '') => email.trim().toLowerCase()

const resolveRoleByEmail = (email) => {
  return ADMIN_EMAILS.includes(normalizeEmail(email)) ? USER_ROLES.admin : USER_ROLES.user
}

const normalizeName = (name = '') => name.trim().replace(/\s+/g, ' ')

const fallbackNameFromEmail = (email = '') => {
  const prefix = normalizeEmail(email).split('@')[0] || ''
  const cleaned = prefix.replace(/[._-]+/g, ' ').trim()
  const titled = cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  if (titled.length >= 2) return titled
  return 'Harbor User'
}

const ensureValidName = (name, email) => {
  const normalized = normalizeName(name)
  return normalized.length >= 2 ? normalized : fallbackNameFromEmail(email)
}

export const registerUser = async ({ email, password, fullName }) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const normalizedEmail = normalizeEmail(email)
  const normalizedName = ensureValidName(fullName, normalizedEmail)

  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email: normalizedEmail,
    fullName: normalizedName,
    role: resolveRoleByEmail(normalizedEmail),
    status: USER_STATUS.active,
    createdAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  })

  return credential.user
}

export const loginUser = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)

  try {
    await updateDoc(doc(db, 'users', credential.user.uid), {
      lastActiveAt: serverTimestamp(),
    })
  } catch {
    // Profile bootstrap is handled by getUserProfile in AuthContext.
  }

  return credential.user
}

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider)

  try {
    await updateDoc(doc(db, 'users', credential.user.uid), {
      lastActiveAt: serverTimestamp(),
    })
  } catch {
    // Profile bootstrap is handled by getUserProfile in AuthContext.
  }

  return credential.user
}

export const signOutUser = () => signOut(auth)

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

export const getUserProfile = async (uid, fallbackEmail, fallbackName = '') => {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)

  if (userDoc.exists()) {
    const existing = userDoc.data()
    const nextName = ensureValidName(existing.fullName || fallbackName, fallbackEmail)

    if (!existing.fullName && nextName) {
      try {
        await updateDoc(userDocRef, {
          fullName: nextName,
        })
      } catch {
        // Name sync is best-effort.
      }
    }

    return {
      ...existing,
      fullName: nextName,
    }
  }

  const normalizedEmail = normalizeEmail(fallbackEmail)
  const normalizedName = ensureValidName(fallbackName, normalizedEmail)

  const profile = {
    uid,
    email: normalizedEmail,
    fullName: normalizedName,
    role: resolveRoleByEmail(normalizedEmail),
    status: USER_STATUS.active,
    createdAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  }

  await setDoc(userDocRef, profile)

  return {
    ...profile,
    createdAt: new Date(),
    lastActiveAt: new Date(),
  }
}

export const syncAdminRoleIfNeeded = async (uid, email, currentProfile) => {
  const normalizedEmail = normalizeEmail(email)
  const shouldBeAdmin = ADMIN_EMAILS.includes(normalizedEmail)

  if (!shouldBeAdmin || currentProfile?.role === USER_ROLES.admin) {
    return currentProfile
  }

  const ensuredFullName = ensureValidName(
    currentProfile?.fullName || '',
    normalizedEmail,
  )

  try {
    await updateDoc(doc(db, 'users', uid), {
      fullName: ensuredFullName,
      role: USER_ROLES.admin,
      lastActiveAt: serverTimestamp(),
    })
  } catch {
    // If rules block this sync, keep role unchanged so route guards stay accurate.
    return currentProfile
  }

  return {
    ...currentProfile,
    fullName: ensuredFullName,
    role: USER_ROLES.admin,
  }
}
