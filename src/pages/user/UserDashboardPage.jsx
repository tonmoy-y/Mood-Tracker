import { useEffect, useMemo, useState } from 'react'
import MoodTracker from '../../components/user/MoodTracker'
import CooldownPopup from '../../components/user/CooldownPopup'
import MoodDailyLog from '../../components/user/MoodDailyLog'
import JournalTimeline from '../../components/user/JournalTimeline'
import StreakCard from '../../components/user/StreakCard'
import InsightsCard from '../../components/user/InsightsCard'
import SupportSection from '../../components/user/SupportSection'
import Button from '../../components/common/Button'
import LoadingScreen from '../../components/common/LoadingScreen'
import { SUPPORT_FALLBACK_MESSAGES } from '../../constants/app'
import { useAuth } from '../../hooks/useAuth'
import UserLayout from '../../layouts/UserLayout'
import { getInsightMessage } from '../../services/insightService'
import { subscribeJournalEntries, upsertJournalEntry } from '../../services/journalService'
import { addMoodEntry, getWeeklyMoodSummary, subscribeMoodEntries } from '../../services/moodService'
import { subscribeSupportMessages } from '../../services/supportService'
import { calculateStreakDays, toDate, toIsoDate } from '../../utils/date'

const MOOD_COOLDOWN_MINUTES = 10

const UserDashboardPage = () => {
  const { user } = useAuth()

  const [moods, setMoods] = useState([])
  const [journals, setJournals] = useState([])
  const [supportMessages, setSupportMessages] = useState([])

  const [loading, setLoading] = useState(true)
  const [savingMood, setSavingMood] = useState(false)
  const [savingJournal, setSavingJournal] = useState(false)
  const [error, setError] = useState('')
  const [cooldownPopup, setCooldownPopup] = useState({
    isOpen: false,
    minutesLeft: 0,
  })

  useEffect(() => {
    if (!user?.uid) return undefined

    setLoading(true)
    setError('')

    const unsubMoods = subscribeMoodEntries(
      user.uid,
      (records) => {
        setMoods(records)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    const unsubJournals = subscribeJournalEntries(
      user.uid,
      (records) => setJournals(records),
      (err) => setError(err.message),
    )

    const unsubSupport = subscribeSupportMessages(
      (records) => {
        setSupportMessages(records.length ? records : SUPPORT_FALLBACK_MESSAGES.map((text, index) => ({
          id: `fallback-${index}`,
          text,
        })))
      },
      () => {
        setSupportMessages(
          SUPPORT_FALLBACK_MESSAGES.map((text, index) => ({
            id: `fallback-${index}`,
            text,
          })),
        )
      },
    )

    return () => {
      unsubMoods()
      unsubJournals()
      unsubSupport()
    }
  }, [user?.uid])

  const weeklySummary = useMemo(() => getWeeklyMoodSummary(moods), [moods])
  const insight = useMemo(() => getInsightMessage(weeklySummary), [weeklySummary])

  const streakDays = useMemo(() => {
    const moodDates = moods
      .map((entry) => toDate(entry.createdAt))
      .filter(Boolean)
      .map((date) => toIsoDate(date))
    const journalDates = journals.map((entry) => entry.date)
    return calculateStreakDays([...moodDates, ...journalDates])
  }, [journals, moods])

  const cooldownState = useMemo(() => {
    const latestMoodAt = moods
      .map((entry) => toDate(entry.createdAt))
      .filter(Boolean)
      .sort((a, b) => b - a)[0]

    if (!latestMoodAt) {
      return { blocked: false, minutesLeft: 0 }
    }

    const nowMs = Date.now()
    const nextAllowedMs = latestMoodAt.getTime() + MOOD_COOLDOWN_MINUTES * 60 * 1000
    const diffMs = nextAllowedMs - nowMs

    if (diffMs <= 0) {
      return { blocked: false, minutesLeft: 0 }
    }

    return {
      blocked: true,
      minutesLeft: Math.ceil(diffMs / (60 * 1000)),
    }
  }, [moods])

  const saveMood = async ({ mood, note }) => {
    if (!user?.uid) return

    if (cooldownState.blocked) {
      const popupText = `You can log your next mood after ${cooldownState.minutesLeft} minute(s).`
      setCooldownPopup({
        isOpen: true,
        minutesLeft: cooldownState.minutesLeft,
      })
      setError(popupText)
      return
    }

    setSavingMood(true)
    setError('')
    try {
      await addMoodEntry({ userId: user.uid, mood, note })
    } catch (err) {
      setError(err.message || 'Could not save mood check-in.')
    } finally {
      setSavingMood(false)
    }
  }

  const saveJournal = async ({ date, text }) => {
    if (!user?.uid) return

    setSavingJournal(true)
    setError('')
    try {
      await upsertJournalEntry({ userId: user.uid, date, text })
    } catch (err) {
      setError(err.message || 'Could not save journal entry.')
    } finally {
      setSavingJournal(false)
    }
  }

  const exportMyData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      moodEntries: moods.map((entry) => ({
        id: entry.id,
        mood: entry.mood,
        note: entry.note,
        createdAt: toDate(entry.createdAt)?.toISOString() || null,
      })),
      journalEntries: journals.map((entry) => ({
        id: entry.id,
        date: entry.date,
        text: entry.text,
      })),
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `harbor-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <UserLayout>
        <LoadingScreen message="Loading your private dashboard..." />
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="grid gap-4">
        {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <section className="surface-card grid gap-4 p-5 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Today</p>
            <h2 className="mt-1 font-display text-3xl leading-tight text-slate-900">
              One small reflection can make the day lighter.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Keep your check-ins short and honest. Your data stays private and only visible to you.
            </p>
            <Button type="button" variant="ghost" className="mt-4" onClick={exportMyData}>
              Export my data (JSON)
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-sky-50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-sky-700">Weekly entries</p>
              <p className="mt-1 text-2xl font-bold text-sky-900">{weeklySummary.total}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-indigo-700">Current streak</p>
              <p className="mt-1 text-2xl font-bold text-indigo-900">{streakDays}</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-emerald-50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Positive ratio</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">{weeklySummary.positiveRatio}%</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <MoodTracker onSave={saveMood} isSaving={savingMood} />
          <StreakCard streakDays={streakDays} totalCheckins={moods.length + journals.length} />
        </div>

        <InsightsCard summary={weeklySummary} insight={insight} />

        <MoodDailyLog entries={moods} />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <JournalTimeline entries={journals} onSave={saveJournal} isSaving={savingJournal} />
          <SupportSection messages={supportMessages} />
        </div>
      </div>

      <CooldownPopup
        isOpen={cooldownPopup.isOpen}
        minutesLeft={cooldownPopup.minutesLeft}
        onClose={() => setCooldownPopup({ isOpen: false, minutesLeft: 0 })}
      />
    </UserLayout>
  )
}

export default UserDashboardPage
