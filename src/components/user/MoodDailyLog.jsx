import { useMemo, useState } from 'react'
import { MOOD_OPTIONS } from '../../constants/app'
import { friendlyDate, toDate, toIsoDate, toTimeLabel } from '../../utils/date'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'

const moodMeta = MOOD_OPTIONS.reduce((acc, mood) => {
  acc[mood.value] = mood
  return acc
}, {})

const RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '7', label: 'Last 7 days' },
  { value: '15', label: 'Last 15 days' },
  { value: '30', label: 'Last 30 days' },
]

const MoodDailyLog = ({ entries }) => {
  const [rangeFilter, setRangeFilter] = useState('7')

  const filteredEntries = useMemo(() => {
    if (rangeFilter === 'all') return entries

    const days = Number(rangeFilter)
    const cutoff = new Date()
    cutoff.setHours(0, 0, 0, 0)
    cutoff.setDate(cutoff.getDate() - (days - 1))

    return entries.filter((entry) => {
      const createdAt = toDate(entry.createdAt)
      if (!createdAt) return false
      return createdAt >= cutoff
    })
  }, [entries, rangeFilter])

  const grouped = useMemo(() => {
    const dayMap = new Map()

    filteredEntries.forEach((entry) => {
      const createdAt = toDate(entry.createdAt)
      const dayKey = entry.dayKey || (createdAt ? toIsoDate(createdAt) : 'Unknown')

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          dayKey,
          items: [],
          counts: { happy: 0, neutral: 0, sad: 0, angry: 0 },
        })
      }

      const bucket = dayMap.get(dayKey)
      bucket.items.push(entry)
      if (bucket.counts[entry.mood] !== undefined) {
        bucket.counts[entry.mood] += 1
      }
    })

    return Array.from(dayMap.values())
      .sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1))
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => {
          const aDate = toDate(a.createdAt)
          const bDate = toDate(b.createdAt)
          if (!aDate || !bDate) return 0
          return bDate - aDate
        }),
      }))
  }, [filteredEntries])

  const selectedLabel =
    RANGE_OPTIONS.find((option) => option.value === rangeFilter)?.label || 'Last 7 days'

  return (
    <Card title="Daily mood timeline" subtitle="See each day with mood count and notes.">
      <div className="mb-4 grid gap-2 sm:grid-cols-[220px_auto] sm:items-center">
        <select
          value={rangeFilter}
          onChange={(event) => setRangeFilter(event.target.value)}
          className="soft-input"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
          Showing {filteredEntries.length} mood log(s) from {selectedLabel.toLowerCase()}.
        </p>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          title="No mood logs in this range"
          message="Try selecting a longer range like last 30 days or all time."
        />
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <section key={group.dayKey} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-xl text-slate-900">{friendlyDate(group.dayKey)}</h3>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((option) => (
                    <span key={`${group.dayKey}-${option.value}`} className="chip">
                      {option.emoji} {group.counts[option.value]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const meta = moodMeta[item.mood] || { emoji: '🙂', label: item.mood }
                  return (
                    <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {meta.emoji} {meta.label}
                        </p>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          {toTimeLabel(item.createdAt)}
                        </p>
                      </div>
                      {item.note ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{item.note}</p>
                      ) : (
                        <p className="mt-2 text-sm italic text-slate-400">No note added.</p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Card>
  )
}

export default MoodDailyLog
