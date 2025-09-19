/**
 * Role Guard Component
 * 
 * Provides role-based access control for routes and components.
 * Checks user permissions and redirects unauthorized users.
 * 
 * @file RoleGuard.tsx
 * @version 1.0.0
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../constants/routes.constants'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import type { UserRole } from '../../types/student.types'

// ============================================================================
// INTERFACES
// ============================================================================

interface RoleGuardProps {
  /**
   * Array of roles that can access this component/route
   */
  allowedRoles: UserRole[]
  
  /**
   * Content to render if user has access
   */
  children: React.ReactNode
  
  /**
   * Custom fallback component for unauthorized access
   */
  fallback?: React.ReactNode
  
  /**
   * Redirect path for unauthorized users (defaults to dashboard)
   */
  redirectTo?: string
  
  /**
   * Show loading state while checking permissions
   */
  showLoading?: boolean
  
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode
}

interface UnauthorizedFallbackProps {
  message?: string
  redirectTo: string
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Default unauthorized access component
 */
const UnauthorizedFallback = ({ 
  message = "You don't have permission to access this page.", 
  redirectTo 
}: UnauthorizedFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg 
          className="w-8 h-8 text-red-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h2>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      <Navigate to={redirectTo} replace />
      
      <div className="text-sm text-gray-500">
        Redirecting to dashboard...
      </div>
    </div>
  </div>
)

/**
 * Default loading component
 */
const DefaultLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner className="mx-auto mb-4" />
      <p className="text-gray-600">Checking permissions...</p>
    </div>
  </div>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * RoleGuard component that wraps content requiring specific user roles
 */
export const RoleGuard = ({ 
  allowedRoles, 
  children, 
  fallback,
  redirectTo = ROUTES.DASHBOARD,
  showLoading = true,
  loadingComponent
}: RoleGuardProps) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  
  // Show loading state while checking authentication
  if (loading && showLoading) {
    return loadingComponent || <DefaultLoadingComponent />
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  
  // Check if user has required role
  const userRole = profile?.role
  const hasAccess = userRole && allowedRoles.includes(userRole as UserRole)
  
  if (!hasAccess) {
    return fallback || (
      <UnauthorizedFallback 
        message={`This page requires one of the following roles: ${allowedRoles.join(', ')}`}
        redirectTo={redirectTo}
      />
    )
  }
  
  return <>{children}</>
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to check if current user has specific role(s)
 */
export const useRoleCheck = (requiredRoles: UserRole | UserRole[]) => {
  const { profile, loading } = useAuth()
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  const userRole = profile?.role as UserRole
  
  return {
    hasRole: userRole && roles.includes(userRole),
    userRole,
    loading,
    isAuthenticated: !!profile
  }
}

/**
 * Hook to get user permissions for navigation and UI
 */
export const usePermissions = () => {
  const { profile } = useAuth()
  const userRole = profile?.role as UserRole
  
  return {
    userRole,
    canManageStudents: userRole && ['super_admin', 'admin'].includes(userRole),
    canViewStudents: userRole && ['super_admin', 'admin', 'teacher'].includes(userRole),
    canManageWorkshops: userRole && ['super_admin', 'admin'].includes(userRole),
    canViewWorkshops: userRole && ['super_admin', 'admin', 'teacher'].includes(userRole),
    canManageCourses: userRole && ['super_admin', 'admin'].includes(userRole),
    canManageTeachers: userRole && ['super_admin', 'admin'].includes(userRole),
    canManageContent: userRole && ['super_admin', 'admin', 'teacher'].includes(userRole),
    isSuperAdmin: userRole === 'super_admin',
    isAdmin: userRole === 'admin',
    isTeacher: userRole === 'teacher'
  }
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

/**
 * Higher-order component for role-based access control
 */
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  options?: Partial<Pick<RoleGuardProps, 'fallback' | 'redirectTo' | 'showLoading'>>
) => {
  const WrappedComponent = (props: P) => (
    <RoleGuard allowedRoles={allowedRoles} {...options}>
      <Component {...props} />
    </RoleGuard>
  )
  
  WrappedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// ============================================================================
// ROUTE-SPECIFIC GUARDS
// ============================================================================

/**
 * Pre-configured guards for common access patterns
 */
export const AdminOnly = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin', 'admin']}>
    {children}
  </RoleGuard>
)

export const SuperAdminOnly = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin']}>
    {children}
  </RoleGuard>
)

export const TeacherAccess = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin', 'admin', 'teacher']}>
    {children}
  </RoleGuard>
)

export const StudentManagement = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin', 'admin', 'teacher']}>
    {children}
  </RoleGuard>
)

export const StudentCreation = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin', 'admin']}>
    {children}
  </RoleGuard>
)

// Export types for external use
export type { RoleGuardProps }
