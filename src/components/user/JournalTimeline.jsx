import { useMemo, useState } from 'react'
import { toIsoDate } from '../../utils/date'
import Button from '../common/Button'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'

const JournalTimeline = ({ entries, onSave, isSaving }) => {
  const [date, setDate] = useState(toIsoDate())
  const [text, setText] = useState('')
  const [searchText, setSearchText] = useState('')
  const [windowFilter, setWindowFilter] = useState('all')

  const sortedEntries = useMemo(() => {
    const now = new Date()

    return [...entries]
      .filter((entry) => {
        if (!searchText.trim()) return true

        return entry.text.toLowerCase().includes(searchText.toLowerCase())
      })
      .filter((entry) => {
        if (windowFilter === 'all') return true

        const entryDate = new Date(`${entry.date}T00:00:00`)
        const deltaDays = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24))

        if (windowFilter === '7d') return deltaDays <= 7
        if (windowFilter === '30d') return deltaDays <= 30
        return true
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [entries, searchText, windowFilter])

  const submitEntry = async (event) => {
    event.preventDefault()
    if (!text.trim()) return

    await onSave({ date, text: text.trim() })
    setText('')
  }

  return (
    <Card title="Daily journal" subtitle="Capture one honest reflection for each day.">
      <form className="space-y-3" onSubmit={submitEntry}>
        <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
          <label className="text-sm font-medium text-slate-700">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="soft-input mt-1 w-full"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Journal text
            <textarea
              rows={4}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write what felt important today..."
              className="soft-input mt-1 w-full"
            />
          </label>
        </div>

        <Button type="submit" disabled={isSaving || !text.trim()}>
          {isSaving ? 'Saving entry...' : 'Save entry'}
        </Button>
      </form>

      <div className="mt-5 space-y-3">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="soft-input w-full"
            placeholder="Search journal text..."
          />
          <select
            value={windowFilter}
            onChange={(event) => setWindowFilter(event.target.value)}
            className="soft-input"
          >
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
            {sortedEntries.length} shown
          </p>
        </div>

        {sortedEntries.length === 0 ? (
          <EmptyState
            title={entries.length ? 'No matching entries' : 'No entries yet'}
            message={
              entries.length
                ? 'Try adjusting search text or filter window.'
                : 'Your timeline will appear here once you save your first journal note.'
            }
          />
        ) : (
          sortedEntries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{entry.date}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{entry.text}</p>
            </article>
          ))
        )}
      </div>
    </Card>
  )
}

export default JournalTimeline
