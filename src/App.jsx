import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppErrorBoundary from './components/common/AppErrorBoundary'
import LoadingScreen from './components/common/LoadingScreen'
import { USER_ROLES } from './constants/app'
import { useAuth } from './hooks/useAuth'
import AuthPage from './pages/auth/AuthPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import UserDashboardPage from './pages/user/UserDashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'

const HomeRedirect = () => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="Loading your space..." />
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />
  }

  return profile.role === USER_ROLES.admin ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/app" replace />
  )
}

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.user]}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.admin]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  )
}

export default App
