import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-3xl text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
