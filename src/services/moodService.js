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
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { toDate, toIsoDate } from '../utils/date'

export const addMoodEntry = async ({ userId, mood, note }) => {
  const now = new Date()
  const dayKey = toIsoDate(now)

  await addDoc(collection(db, 'moods'), {
    userId,
    mood,
    note: note || '',
    dayKey,
    createdAt: serverTimestamp(),
  })

  await updateDoc(doc(db, 'users', userId), {
    lastActiveAt: serverTimestamp(),
  })
}

export const subscribeMoodEntries = (userId, onData, onError) => {
  const moodQuery = query(
    collection(db, 'moods'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(90),
  )

  return onSnapshot(
    moodQuery,
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
    },
    onError,
  )
}

export const getWeeklyMoodSummary = (entries) => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const weeklyEntries = entries.filter((entry) => {
    const createdAt = toDate(entry.createdAt)
    return createdAt && createdAt >= sevenDaysAgo
  })

  const counts = weeklyEntries.reduce(
    (acc, entry) => {
      if (acc[entry.mood] !== undefined) acc[entry.mood] += 1
      return acc
    },
    { happy: 0, neutral: 0, sad: 0, angry: 0 },
  )

  const total = weeklyEntries.length
  const dominantMood =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'

  return {
    total,
    counts,
    dominantMood,
    positiveRatio: total ? Math.round((counts.happy / total) * 100) : 0,
  }
}
