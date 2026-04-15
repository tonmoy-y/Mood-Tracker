const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-2xl border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/90 to-indigo-50/70 p-6 text-center">
      <p className="font-display text-xl text-slate-800">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
    </div>
  )
}

export default EmptyState
