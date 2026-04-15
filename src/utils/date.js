import {
  differenceInCalendarDays,
  format,
  isToday,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'

export const toDate = (value) => {
  if (!value) return null
  if (value?.toDate) return value.toDate()
  if (value instanceof Date) return value
  if (typeof value === 'string') return parseISO(value)
  return null
}

export const toIsoDate = (value = new Date()) => format(value, 'yyyy-MM-dd')

export const toHourKey = (value = new Date()) => format(value, 'yyyy-MM-dd-HH')

export const toTimeLabel = (value) => {
  const date = toDate(value)
  if (!date) return '--:--'
  return format(date, 'h:mm a')
}

export const friendlyDate = (value) => {
  const date = toDate(value)
  if (!date) return '-'
  if (isToday(date)) return 'Today'
  return format(date, 'MMM d, yyyy')
}

export const calculateStreakDays = (dates) => {
  const normalized = Array.from(new Set(dates.filter(Boolean))).sort((a, b) =>
    a > b ? -1 : 1,
  )

  if (!normalized.length) return 0

  let streak = 0
  let cursor = startOfDay(new Date())

  if (normalized[0] !== toIsoDate(cursor)) {
    cursor = subDays(cursor, 1)
    if (normalized[0] !== toIsoDate(cursor)) return 0
  }

  while (normalized.includes(toIsoDate(cursor))) {
    streak += 1
    cursor = subDays(cursor, 1)
  }

  return streak
}

export const daysSince = (value) => {
  const date = toDate(value)
  if (!date) return null
  return differenceInCalendarDays(new Date(), date)
}
