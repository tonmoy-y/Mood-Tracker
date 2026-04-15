import { useEffect, useMemo, useState } from 'react'
import AnalyticsPanel from '../../components/admin/AnalyticsPanel'
import SupportMessageManager from '../../components/admin/SupportMessageManager'
import UserManagementPanel from '../../components/admin/UserManagementPanel'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../hooks/useAuth'
import AdminLayout from '../../layouts/AdminLayout'
import {
  getGrowthMetrics,
  setUserStatus,
  subscribeOverviewStats,
  subscribeUsers,
} from '../../services/adminService'
import { createSupportMessage, editSupportMessage, subscribeSupportMessages } from '../../services/supportService'

const AdminDashboardPage = () => {
  const { user } = useAuth()

  const [users, setUsers] = useState([])
  const [overviewStats, setOverviewStats] = useState(null)
  const [supportMessages, setSupportMessages] = useState([])

  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState('')
  const [contentSaving, setContentSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    const unsubUsers = subscribeUsers(
      (records) => {
        setUsers(records)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    const unsubOverview = subscribeOverviewStats(
      (record) => setOverviewStats(record),
      (err) => setError(err.message),
    )

    const unsubSupport = subscribeSupportMessages(
      (records) => setSupportMessages(records),
      (err) => setError(err.message),
    )

    return () => {
      unsubUsers()
      unsubOverview()
      unsubSupport()
    }
  }, [])

  const growth = useMemo(() => getGrowthMetrics(users), [users])

  const handleUserStatus = async (uid, status) => {
    setStatusLoading(uid)
    setError('')

    try {
      await setUserStatus(uid, status)
    } catch (err) {
      setError(err.message || 'Unable to update user status.')
    } finally {
      setStatusLoading('')
    }
  }

  const handleCreateSupportMessage = async (text) => {
    if (!user?.uid) return

    setContentSaving(true)
    setError('')

    try {
      await createSupportMessage(text, user.uid)
    } catch (err) {
      setError(err.message || 'Unable to add support message.')
    } finally {
      setContentSaving(false)
    }
  }

  const handleUpdateSupportMessage = async (id, text) => {
    setContentSaving(true)
    setError('')

    try {
      await editSupportMessage(id, text)
    } catch (err) {
      setError(err.message || 'Unable to edit support message.')
    } finally {
      setContentSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingScreen message="Loading admin dashboard..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <section className="surface-card-admin overflow-hidden p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-700">System overview</p>
          <h2 className="mt-1 font-display text-3xl text-slate-900">Privacy-safe mental health analytics</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            This admin console shows only aggregate insights and account status. Sensitive user moods, notes, and journals are intentionally inaccessible.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={growth.totalUsers} tone="default" />
          <StatCard label="Active today" value={growth.activeToday} tone="soft" />
          <StatCard label="Active this week" value={growth.activeThisWeek} tone="mint" />
          <StatCard label="Joined this month" value={growth.joinedThisMonth} tone="warm" />
        </section>

        <section id="analytics">
          <AnalyticsPanel overviewStats={overviewStats} />
        </section>

        <section id="users">
          <UserManagementPanel users={users} loading={statusLoading} onStatusToggle={handleUserStatus} />
        </section>

        <section id="support">
          <SupportMessageManager
            messages={supportMessages}
            saving={contentSaving}
            onCreate={handleCreateSupportMessage}
            onUpdate={handleUpdateSupportMessage}
          />
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage
