const CooldownPopup = ({ isOpen, minutesLeft, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4">
      <div className="surface-card w-full max-w-md p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Mood cooldown</p>
        <h3 className="mt-1 font-display text-2xl text-slate-900">Hold on a little bit</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          You can log your next mood after <span className="font-semibold">{minutesLeft} minute(s)</span>.
          This keeps your mood history spaced and meaningful.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-[#1d4d8a] to-[#2e66ad] px-4 py-2 text-sm font-semibold text-white transition hover:from-[#174074] hover:to-[#255792]"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  )
}

export default CooldownPopup
