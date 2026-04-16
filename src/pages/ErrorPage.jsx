import { Link } from 'react-router-dom'

const ErrorPage = ({
  code = '500',
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this page.',
  details = '',
  primaryActionLabel = 'Reload',
  onPrimaryAction,
}) => {
  const handleReload = () => {
    if (onPrimaryAction) {
      onPrimaryAction()
      return
    }

    window.location.reload()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-14 top-10 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl float-slow" />
      <div className="pointer-events-none absolute -right-8 bottom-8 h-52 w-52 rounded-full bg-indigo-200/55 blur-3xl float-slower" />

      <section className="surface-card soft-enter relative w-full max-w-2xl p-8 sm:p-10">
        <span className="chip">Error {code}</span>

        <h1 className="mt-4 font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{message}</p>

        {details ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-500">
            {details}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#1d4d8a] to-[#2e66ad] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-900/20 transition hover:from-[#174074] hover:to-[#255792]"
          >
            {primaryActionLabel}
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ErrorPage