import Card from '../common/Card'

const StreakCard = ({ streakDays, totalCheckins }) => {
  return (
    <Card title="Streak" subtitle="Consistent check-ins build better self-awareness.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-sky-700">Current streak</p>
          <p className="mt-2 text-3xl font-bold text-sky-900">{streakDays} days</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-600">Total check-ins</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalCheckins}</p>
        </div>
      </div>
    </Card>
  )
}

export default StreakCard
