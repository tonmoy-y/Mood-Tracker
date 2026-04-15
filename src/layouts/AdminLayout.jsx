import { useState } from 'react'
import { APP_NAME } from '../constants/app'
import { useAuth } from '../hooks/useAuth'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = ({ children }) => {
  const { profile, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#f1f5fb_50%,_#eef2f7_100%)]">
      <div className="flex min-h-screen">
        <AdminSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  Menu
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-700">{APP_NAME}</p>
                  <h1 className="font-display text-2xl text-slate-900">Admin Console</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="hidden text-sm text-slate-600 md:block">{profile?.email}</p>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>
          <section className="mx-auto max-w-7xl p-4 sm:p-6">{children}</section>
        </div>
      </div>
    </main>
  )
}

export default AdminLayout
