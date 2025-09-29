import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Permission } from '@/constants/permissions'

// Constants following AI coding rules
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
} as const

const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/admin'
} as const

const ERROR_MESSAGES = {
  ACCESS_DENIED_TITLE: 'Access Denied',
  ACCESS_DENIED_DESCRIPTION: "You don't have permission to access this page.",
  LOADING_MESSAGE: 'Loading...'
} as const

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredPermission?: Permission
  fallbackPath?: string
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredPermission,
  fallbackPath = ROUTES.LOGIN 
}: ProtectedRouteProps) => {
  const { user, loading, profile, hasPermission, hasRole } = useAuth()

  const isBypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true'
  if (isBypassAuth) {
    return <>{children}</>
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">{ERROR_MESSAGES.LOADING_MESSAGE}</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />
  }

  // Check access based on roles or permissions
  const hasAccess = () => {
    // Check role-based access
    if (requiredRoles.length > 0 && profile && !requiredRoles.some(role => hasRole(role))) {
      return false
    }
    
    // Check permission-based access
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return false
    }
    
    return true
  }

  if (!hasAccess()) {
    // If no profile exists at all, redirect to login
    if (!profile) {
      return <Navigate to={fallbackPath} replace />
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg 
                className="h-8 w-8 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {ERROR_MESSAGES.ACCESS_DENIED_TITLE}
            </h2>
            <p className="text-gray-600 mb-6">
              {ERROR_MESSAGES.ACCESS_DENIED_DESCRIPTION}
            </p>
            <div className="text-sm text-gray-500 mb-6">
              {requiredRoles.length > 0 && (
                <p>Required roles: {requiredRoles.join(', ')}</p>
              )}
              {requiredPermission && (
                <p>Required permission: {requiredPermission}</p>
              )}
              <p>Your role: {profile?.role || 'None'}</p>
              <p className="mt-2 text-blue-600">
                Contact an administrator to upgrade your account permissions.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Go Back
            </button>
            <Navigate to={fallbackPath} replace />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Both named and default exports for compatibility
export { ProtectedRoute }
export default ProtectedRoute

// Export the interface for type safety
export type { ProtectedRouteProps }

// Export constants for external use
export { AUTH_STATES, ROUTES, ERROR_MESSAGES }