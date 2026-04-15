import { NavLink } from 'react-router-dom'

const navItem = ({ isActive }) =>
  [
    'block rounded-xl px-3 py-2.5 text-sm font-semibold transition',
    isActive
      ? 'bg-gradient-to-r from-[#1d4d8a] to-[#2f67ab] text-white shadow-sm'
      : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={[
          'fixed inset-0 z-30 bg-slate-900/35 transition lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />
      <aside
        className={[
          'fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white/95 p-4 shadow-xl transition lg:static lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
        <nav className="space-y-2">
          <NavLink to="/admin" end className={navItem} onClick={onClose}>
            Overview
          </NavLink>
          <a href="#users" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={onClose}>
            User Management
          </a>
          <a href="#analytics" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={onClose}>
            Analytics
          </a>
          <a href="#support" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={onClose}>
            Support Messages
          </a>
        </nav>
      </aside>
    </>
  )
}

export default AdminSidebar
