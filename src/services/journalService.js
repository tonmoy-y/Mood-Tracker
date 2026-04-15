import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const upsertJournalEntry = async ({ userId, date, text }) => {
  const entryId = `${userId}_${date}`

  await setDoc(
    doc(db, 'journals', entryId),
    {
      userId,
      date,
      text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  await updateDoc(doc(db, 'users', userId), {
    lastActiveAt: serverTimestamp(),
  })
}

export const subscribeJournalEntries = (userId, onData, onError) => {
  const journalQuery = query(
    collection(db, 'journals'),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(90),
  )

  return onSnapshot(
    journalQuery,
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
    },
    onError,
  )
}
