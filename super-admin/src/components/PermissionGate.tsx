import { useAuth } from '@/contexts/AuthContext'
import type { Permission } from '@/constants/permissions'

interface PermissionGateProps {
  permission?: Permission
  role?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({
  permission,
  role,
  fallback = null,
  children
}: PermissionGateProps) {
  const { profile, hasPermission, hasRole } = useAuth()

  if (!profile) {
    return <>{fallback}</>
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  // Check permission if specified
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
