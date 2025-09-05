import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UI_TEXTS } from '../constants/uiTexts'
import type { Permission } from '../constants/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermission?: Permission
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: ProtectedRouteProps) {
  const isBypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true'
  const { user, profile, loading, hasPermission } = useAuth()

  if (isBypassAuth) {
    return <>{children}</>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">{UI_TEXTS.LOADING}</div>
    </div>
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-red-600">Access Denied</div>
    </div>
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-red-600">Insufficient Permissions</div>
    </div>
  }

  return <>{children}</>
}
