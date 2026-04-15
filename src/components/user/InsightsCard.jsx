import Card from '../common/Card'

const InsightsCard = ({ summary, insight }) => {
  const { total, counts, positiveRatio } = summary

  return (
    <Card title="Weekly insights" subtitle="Simple pattern-based view of your last 7 days.">
      <div className="grid gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Entries</p>
          <p className="text-xl font-bold text-slate-900">{total}</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Happy</p>
          <p className="text-xl font-bold text-slate-900">{counts.happy}</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Neutral</p>
          <p className="text-xl font-bold text-slate-900">{counts.neutral}</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Positive ratio</p>
          <p className="text-xl font-bold text-slate-900">{positiveRatio}%</p>
        </div>
      </div>
      <p className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-3 text-sm leading-relaxed text-slate-700">
        {insight}
      </p>
    </Card>
  )
}

export default InsightsCard
