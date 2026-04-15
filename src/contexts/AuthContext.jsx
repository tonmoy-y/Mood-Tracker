import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { USER_STATUS } from '../constants/app'
import { auth } from '../firebase/config'
import { AuthContext } from './auth-context'
import {
  getUserProfile,
  loginWithGoogle,
  loginUser,
  resetPassword,
  registerUser,
  signOutUser,
  syncAdminRoleIfNeeded,
} from '../services/authService'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setAuthError('')

      if (!nextUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(nextUser)

      try {
        // Ensure auth token is minted before first Firestore request.
        await nextUser.getIdToken()

        const loadedProfile = await getUserProfile(
          nextUser.uid,
          nextUser.email,
          nextUser.displayName || '',
        )

        const nextProfile = await syncAdminRoleIfNeeded(
          nextUser.uid,
          nextUser.email || '',
          loadedProfile,
        )

        if (nextProfile.status === USER_STATUS.inactive) {
          await signOutUser()
          setAuthError('Your account is inactive. Please contact support.')
          setUser(null)
          setProfile(null)
        } else {
          setProfile(nextProfile)
        }
      } catch (error) {
        setAuthError(error.message || 'Unable to load account profile.')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      authError,
      register: registerUser,
      login: loginUser,
      loginWithGoogle,
      resetPassword,
      logout: signOutUser,
    }),
    [authError, loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
