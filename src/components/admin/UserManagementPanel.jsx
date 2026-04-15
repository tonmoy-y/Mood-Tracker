import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import Button from '../common/Button'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'

const formatDate = (value) => {
  if (!value) return '-'
  const date = value?.toDate ? value.toDate() : value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '-'
  return format(date, 'MMM d, yyyy')
}

const UserManagementPanel = ({ users, onStatusToggle, loading }) => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchText.trim()
        || (user.email || '').toLowerCase().includes(searchText.toLowerCase())
        || (user.fullName || '').toLowerCase().includes(searchText.toLowerCase())

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchText, statusFilter, users])

  return (
    <Card
      title="User management"
      subtitle="Manage account access without viewing personal emotional data."
      className="surface-card-admin"
    >
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_180px]">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="soft-input w-full"
          placeholder="Search by email or full name..."
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="soft-input"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState title="No users found" message="Users will appear here after registration." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="px-2 py-3">Full name</th>
                <th className="px-2 py-3">Email</th>
                <th className="px-2 py-3">Joined</th>
                <th className="px-2 py-3">Role</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isActive = user.status === 'active'
                return (
                  <tr key={user.uid} className="border-b border-slate-100/90 hover:bg-slate-50/70">
                    <td className="px-2 py-3 text-slate-700">{user.fullName || '-'}</td>
                    <td className="px-2 py-3 text-slate-700">{user.email}</td>
                    <td className="px-2 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-2 py-3 text-slate-600">{user.role}</td>
                    <td className="px-2 py-3">
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700',
                        ].join(' ')}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <Button
                        variant={isActive ? 'danger' : 'primary'}
                        disabled={loading === user.uid}
                        onClick={() => onStatusToggle(user.uid, isActive ? 'inactive' : 'active')}
                      >
                        {loading === user.uid
                          ? 'Saving...'
                          : isActive
                            ? 'Deactivate'
                            : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default UserManagementPanel
