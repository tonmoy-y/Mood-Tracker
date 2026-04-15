import { useState } from 'react'
import { MOOD_OPTIONS } from '../../constants/app'
import Button from '../common/Button'
import Card from '../common/Card'

const MoodTracker = ({ onSave, isSaving }) => {
  const [selectedMood, setSelectedMood] = useState('happy')
  const [note, setNote] = useState('')

  const submitMood = async (event) => {
    event.preventDefault()
    await onSave({ mood: selectedMood, note })
    setNote('')
  }

  return (
    <Card title="Mood tracker" subtitle="How are you feeling right now?">
      <form onSubmit={submitMood} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = selectedMood === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedMood(option.value)}
                className={[
                  'rounded-2xl border px-3 py-3 text-left transition duration-200',
                  isSelected
                    ? 'border-sky-600 bg-gradient-to-br from-sky-50 to-blue-50 text-sky-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/40',
                ].join(' ')}
              >
                <p className="text-2xl">{option.emoji}</p>
                <p className="mt-1 text-sm font-semibold">{option.label}</p>
              </button>
            )
          })}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Optional note</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={180}
            className="soft-input w-full"
            placeholder="A short note, if you want to remember this moment..."
          />
        </label>

        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? 'Saving...' : 'Save check-in'}
        </Button>
      </form>
    </Card>
  )
}

export default MoodTracker
