const StatCard = ({ label, value, tone = 'default' }) => {
  const toneMap = {
    default: 'from-slate-900 to-slate-700',
    soft: 'from-[#1d4d8a] to-[#3c77bf]',
    mint: 'from-emerald-700 to-teal-700',
    warm: 'from-amber-600 to-orange-600',
  }

  return (
    <div className="surface-card-admin p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={[
        'mt-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent',
        toneMap[tone],
      ].join(' ')}>
        {value}
      </p>
    </div>
  )
}

export default StatCard
