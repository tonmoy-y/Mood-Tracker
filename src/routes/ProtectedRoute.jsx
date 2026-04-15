import { Navigate } from 'react-router-dom'
import { USER_ROLES } from '../constants/app'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../components/common/LoadingScreen'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="Preparing your safe space..." />
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    if (profile.role === USER_ROLES.admin) {
      return <Navigate to="/admin" replace />
    }

    return <Navigate to="/app" replace />
  }

  return children
}

export default ProtectedRoute
