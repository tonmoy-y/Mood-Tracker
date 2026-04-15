import Card from '../common/Card'

const percentage = (value, total) => {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

const AnalyticsPanel = ({ overviewStats }) => {
  const totalMoods = overviewStats?.totalMoods || 0
  const distribution = overviewStats?.moodDistribution || {
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
  }

  return (
    <Card
      title="Mood analytics (aggregated only)"
      subtitle="No identity, no notes, no personal journal data."
      className="surface-card-admin"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(distribution).map(([mood, value]) => (
          <div key={mood} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{mood}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{percentage(value, totalMoods)}</p>
            <p className="text-xs text-slate-500">{value} logs</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-600">Total moods logged: {totalMoods}</p>
    </Card>
  )
}

export default AnalyticsPanel
