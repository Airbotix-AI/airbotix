/**
 * Routes Constants - Enhanced Configuration
 * 
 * Comprehensive route definitions with nested paths, labels, and metadata
 * for the Student Management system and future modules.
 * 
 * @file routes.constants.ts
 * @version 1.0.0
 */

import { USER_ROLES } from './userRoles'
import type { UserRole } from '../types/student.types'

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

/**
 * Main route structure with nested paths
 */
export const ROUTES = {
  // Public routes
  LOGIN: '/',
  NOT_FOUND: '/404',
  
  // Admin base
  ADMIN: '/admin',
  
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  
  // Student Management Routes
  STUDENTS: {
    INDEX: '/admin/students',
    NEW: '/admin/students/new',
    DETAILS: '/admin/students/:id',
    EDIT: '/admin/students/:id/edit',
    IMPORT: '/admin/students/import',
    EXPORT: '/admin/students/export'
  },
  
  // Workshop Management Routes
  WORKSHOPS: {
    INDEX: '/admin/workshops',
    NEW: '/admin/workshops/new',
    DETAILS: '/admin/workshops/:id',
    EDIT: '/admin/workshops/:id/edit',
    MANAGE: '/admin/workshops/:id/manage'
  },
  
  // Course Management Routes
  COURSES: {
    INDEX: '/admin/courses',
    NEW: '/admin/courses/new',
    DETAILS: '/admin/courses/:id',
    EDIT: '/admin/courses/:id/edit'
  },
  
  // Teacher Management Routes
  TEACHERS: {
    INDEX: '/admin/teachers',
    NEW: '/admin/teachers/new',
    DETAILS: '/admin/teachers/:id',
    EDIT: '/admin/teachers/:id/edit'
  },
  
  // Content Management Routes
  CONTENT: {
    INDEX: '/admin/content',
    NEW: '/admin/content/new',
    DETAILS: '/admin/content/:id',
    EDIT: '/admin/content/:id/edit'
  }
} as const

/**
 * Route labels for breadcrumbs and navigation
 */
export const ROUTE_LABELS = {
  // Main sections
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.STUDENTS.INDEX]: 'Students',
  [ROUTES.WORKSHOPS.INDEX]: 'Workshops',
  [ROUTES.COURSES.INDEX]: 'Courses',
  [ROUTES.TEACHERS.INDEX]: 'Teachers',
  [ROUTES.CONTENT.INDEX]: 'Content',
  
  // Student routes
  [ROUTES.STUDENTS.NEW]: 'Add Student',
  [ROUTES.STUDENTS.DETAILS]: 'Student Details',
  [ROUTES.STUDENTS.EDIT]: 'Edit Student',
  [ROUTES.STUDENTS.IMPORT]: 'Import Students',
  [ROUTES.STUDENTS.EXPORT]: 'Export Students',
  
  // Workshop routes
  [ROUTES.WORKSHOPS.NEW]: 'Add Workshop',
  [ROUTES.WORKSHOPS.DETAILS]: 'Workshop Details',
  [ROUTES.WORKSHOPS.EDIT]: 'Edit Workshop',
  [ROUTES.WORKSHOPS.MANAGE]: 'Manage Workshop',
  
  // Course routes
  [ROUTES.COURSES.NEW]: 'Add Course',
  [ROUTES.COURSES.DETAILS]: 'Course Details',
  [ROUTES.COURSES.EDIT]: 'Edit Course',
  
  // Teacher routes
  [ROUTES.TEACHERS.NEW]: 'Add Teacher',
  [ROUTES.TEACHERS.DETAILS]: 'Teacher Details',
  [ROUTES.TEACHERS.EDIT]: 'Edit Teacher',
  
  // Content routes
  [ROUTES.CONTENT.NEW]: 'Add Content',
  [ROUTES.CONTENT.DETAILS]: 'Content Details',
  [ROUTES.CONTENT.EDIT]: 'Edit Content'
} as const

// ============================================================================
// ROUTE METADATA
// ============================================================================

/**
 * Route metadata for navigation and permissions
 */
export interface RouteMetadata {
  title: string
  description: string
  icon: string
  requiresAuth: boolean
  allowedRoles?: UserRole[]
  parentRoute?: string
  showInNavigation?: boolean
  badge?: boolean
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Admin dashboard overview',
    icon: 'LayoutDashboard',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    showInNavigation: true
  },
  
  [ROUTES.STUDENTS.INDEX]: {
    title: 'Students',
    description: 'Student management',
    icon: 'Users',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    showInNavigation: true,
    badge: true
  },
  
  [ROUTES.STUDENTS.NEW]: {
    title: 'Add Student',
    description: 'Create new student profile',
    icon: 'UserPlus',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    parentRoute: ROUTES.STUDENTS.INDEX,
    showInNavigation: false
  },
  
  [ROUTES.STUDENTS.DETAILS]: {
    title: 'Student Details',
    description: 'View student information',
    icon: 'User',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    parentRoute: ROUTES.STUDENTS.INDEX,
    showInNavigation: false
  },
  
  [ROUTES.STUDENTS.EDIT]: {
    title: 'Edit Student',
    description: 'Edit student information',
    icon: 'UserPen',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    parentRoute: ROUTES.STUDENTS.INDEX,
    showInNavigation: false
  },
  
  [ROUTES.WORKSHOPS.INDEX]: {
    title: 'Workshops',
    description: 'Workshop management',
    icon: 'Calendar',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    showInNavigation: true
  },
  
  [ROUTES.COURSES.INDEX]: {
    title: 'Courses',
    description: 'Course management',
    icon: 'BookOpen',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    showInNavigation: true
  },
  
  [ROUTES.TEACHERS.INDEX]: {
    title: 'Teachers',
    description: 'Teacher management',
    icon: 'GraduationCap',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    showInNavigation: true
  },
  
  [ROUTES.CONTENT.INDEX]: {
    title: 'Content',
    description: 'Content management',
    icon: 'FileText',
    requiresAuth: true,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER],
    showInNavigation: true
  }
}

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================

/**
 * Enhanced breadcrumb configuration with dynamic route support
 */
export const BREADCRUMB_CONFIG: Record<string, string[]> = {
  [ROUTES.DASHBOARD]: ['Dashboard'],
  
  // Student routes
  [ROUTES.STUDENTS.INDEX]: ['Dashboard', 'Students'],
  [ROUTES.STUDENTS.NEW]: ['Dashboard', 'Students', 'Add Student'],
  [ROUTES.STUDENTS.DETAILS]: ['Dashboard', 'Students', 'Student Details'],
  [ROUTES.STUDENTS.EDIT]: ['Dashboard', 'Students', 'Edit Student'],
  [ROUTES.STUDENTS.IMPORT]: ['Dashboard', 'Students', 'Import Students'],
  [ROUTES.STUDENTS.EXPORT]: ['Dashboard', 'Students', 'Export Students'],
  
  // Workshop routes
  [ROUTES.WORKSHOPS.INDEX]: ['Dashboard', 'Workshops'],
  [ROUTES.WORKSHOPS.NEW]: ['Dashboard', 'Workshops', 'Add Workshop'],
  [ROUTES.WORKSHOPS.DETAILS]: ['Dashboard', 'Workshops', 'Workshop Details'],
  [ROUTES.WORKSHOPS.EDIT]: ['Dashboard', 'Workshops', 'Edit Workshop'],
  [ROUTES.WORKSHOPS.MANAGE]: ['Dashboard', 'Workshops', 'Manage Workshop'],
  
  // Course routes
  [ROUTES.COURSES.INDEX]: ['Dashboard', 'Courses'],
  [ROUTES.COURSES.NEW]: ['Dashboard', 'Courses', 'Add Course'],
  [ROUTES.COURSES.DETAILS]: ['Dashboard', 'Courses', 'Course Details'],
  [ROUTES.COURSES.EDIT]: ['Dashboard', 'Courses', 'Edit Course'],
  
  // Teacher routes
  [ROUTES.TEACHERS.INDEX]: ['Dashboard', 'Teachers'],
  [ROUTES.TEACHERS.NEW]: ['Dashboard', 'Teachers', 'Add Teacher'],
  [ROUTES.TEACHERS.DETAILS]: ['Dashboard', 'Teachers', 'Teacher Details'],
  [ROUTES.TEACHERS.EDIT]: ['Dashboard', 'Teachers', 'Edit Teacher'],
  
  // Content routes
  [ROUTES.CONTENT.INDEX]: ['Dashboard', 'Content'],
  [ROUTES.CONTENT.NEW]: ['Dashboard', 'Content', 'Add Content'],
  [ROUTES.CONTENT.DETAILS]: ['Dashboard', 'Content', 'Content Details'],
  [ROUTES.CONTENT.EDIT]: ['Dashboard', 'Content', 'Edit Content']
}

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

/**
 * Generate dynamic route with parameters
 */
export const generateRoute = (template: string, params: Record<string, string>): string => {
  return Object.entries(params).reduce(
    (route, [key, value]) => route.replace(`:${key}`, value),
    template
  )
}

/**
 * Check if user has access to route
 */
export const hasRouteAccess = (route: string, userRole: UserRole): boolean => {
  const metadata = ROUTE_METADATA[route]
  if (!metadata) return false
  
  if (!metadata.allowedRoles) return true
  return metadata.allowedRoles.includes(userRole)
}

/**
 * Get navigation items for user role
 */
export const getNavigationItems = (userRole: UserRole) => {
  return Object.entries(ROUTE_METADATA)
    .filter(([route, metadata]) => 
      metadata.showInNavigation && hasRouteAccess(route, userRole)
    )
    .map(([route, metadata]) => ({
      route,
      ...metadata
    }))
}

/**
 * Extract route parameters from pathname
 */
export const extractRouteParams = (template: string, pathname: string): Record<string, string> => {
  const templateParts = template.split('/')
  const pathnameParts = pathname.split('/')
  const params: Record<string, string> = {}
  
  if (templateParts.length !== pathnameParts.length) {
    return params
  }
  
  templateParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1)
      params[paramName] = pathnameParts[index]
    }
  })
  
  return params
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy route constants for backward compatibility
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  STUDENTS: ROUTES.STUDENTS.INDEX,
  TEACHERS: ROUTES.TEACHERS.INDEX,
  WORKSHOPS: ROUTES.WORKSHOPS.INDEX,
  COURSES: ROUTES.COURSES.INDEX,
  CONTENT: ROUTES.CONTENT.INDEX
} as const

export const PUBLIC_ROUTES = {
  LOGIN: ROUTES.LOGIN,
  NOT_FOUND: ROUTES.NOT_FOUND
} as const

export const ALL_ROUTES = {
  ...PROTECTED_ROUTES,
  ...PUBLIC_ROUTES
} as const

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type RouteTemplate = keyof typeof ROUTE_LABELS
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES]
export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES]
export type AllRoute = typeof ALL_ROUTES[keyof typeof ALL_ROUTES]
