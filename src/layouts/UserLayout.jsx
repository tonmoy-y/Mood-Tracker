import { NavLink } from 'react-router-dom'
import { APP_NAME } from '../constants/app'
import { useAuth } from '../hooks/useAuth'

const navClasses = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-gradient-to-r from-[#1d4d8a] to-[#2f67ab] text-white shadow-md shadow-sky-800/20'
      : 'bg-white/85 text-slate-700 hover:bg-white',
  ].join(' ')

const UserLayout = ({ children }) => {
  const { profile, logout } = useAuth()
  const displayName =
    profile?.fullName?.trim() || profile?.email?.split('@')?.[0] || 'there'

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-8 pt-6">
      <div className="pointer-events-none absolute left-0 top-16 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-44 h-52 w-52 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <header className="surface-card relative mb-6 overflow-hidden px-5 py-4 sm:px-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-100/70 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-700">{APP_NAME}</p>
              <h1 className="font-display text-3xl leading-tight text-slate-900">Your calm check-in space</h1>
              <p className="mt-1 text-sm text-slate-600">Welcome back, {displayName}.</p>
            </div>
            <div className="flex items-center gap-2">
              <NavLink to="/app" className={navClasses}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="btn rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">Private by design</span>
            <span className="chip">Daily reflection</span>
            <span className="chip">Weekly insights</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">Signed in as {profile?.email}</p>
        </header>
        {children}
      </div>
    </main>
  )
}

export default UserLayout
