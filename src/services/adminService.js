import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { daysSince, toDate } from '../utils/date'

export const subscribeUsers = (onData, onError) => {
  const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    usersQuery,
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
    },
    onError,
  )
}

export const setUserStatus = (uid, status) => {
  return updateDoc(doc(db, 'users', uid), { status })
}

export const subscribeOverviewStats = (onData, onError) => {
  return onSnapshot(
    doc(db, 'adminStats', 'overview'),
    (snapshot) => {
      onData(snapshot.exists() ? snapshot.data() : null)
    },
    onError,
  )
}

export const getGrowthMetrics = (users) => {
  const now = new Date()
  const activeToday = users.filter((user) => daysSince(user.lastActiveAt) === 0).length
  const activeThisWeek = users.filter((user) => {
    const delta = daysSince(user.lastActiveAt)
    return delta !== null && delta <= 6
  }).length

  const joinedThisMonth = users.filter((user) => {
    const createdAt = toDate(user.createdAt)
    return createdAt && createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
  }).length

  return {
    totalUsers: users.length,
    activeToday,
    activeThisWeek,
    joinedThisMonth,
  }
}
