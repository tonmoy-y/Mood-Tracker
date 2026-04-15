import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const subscribeSupportMessages = (onData, onError) => {
  const supportQuery = query(
    collection(db, 'supportMessages'),
    orderBy('createdAt', 'desc'),
    limit(30),
  )

  return onSnapshot(
    supportQuery,
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
    },
    onError,
  )
}

export const createSupportMessage = async (text, createdBy) => {
  await addDoc(collection(db, 'supportMessages'), {
    text,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const editSupportMessage = async (id, text) => {
  await updateDoc(doc(db, 'supportMessages', id), {
    text,
    updatedAt: serverTimestamp(),
  })
}
