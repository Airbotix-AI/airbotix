import { USER_ROLES } from './userRoles'

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/admin',
  STUDENTS: '/admin/students',
  TEACHERS: '/admin/teachers',
  WORKSHOPS: '/admin/workshops',
  COURSES: '/admin/courses',
  CONTENT: '/admin/content'
} as const

// Public routes
export const PUBLIC_ROUTES = {
  LOGIN: '/',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized'
} as const

// All routes
export const ALL_ROUTES = {
  ...PROTECTED_ROUTES,
  ...PUBLIC_ROUTES
} as const

// Legacy export for compatibility
export const ROUTE_PATHS = ALL_ROUTES

// Role-based route permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PROTECTED_ROUTES),
  [USER_ROLES.ADMIN]: [
    PROTECTED_ROUTES.DASHBOARD,
    PROTECTED_ROUTES.STUDENTS,
    PROTECTED_ROUTES.TEACHERS,
    PROTECTED_ROUTES.WORKSHOPS,
    PROTECTED_ROUTES.COURSES,
    PROTECTED_ROUTES.CONTENT
  ],
  [USER_ROLES.TEACHER]: [
    PROTECTED_ROUTES.DASHBOARD,
    PROTECTED_ROUTES.WORKSHOPS,
    PROTECTED_ROUTES.STUDENTS,
    PROTECTED_ROUTES.CONTENT
  ]
} as const

// Route metadata
export const ROUTE_METADATA = {
  [PROTECTED_ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Admin dashboard overview',
    icon: 'LayoutDashboard',
    requiresAuth: true
  },
  [PROTECTED_ROUTES.STUDENTS]: {
    title: 'Students',
    description: 'Student management',
    icon: 'Users',
    requiresAuth: true
  },
  [PROTECTED_ROUTES.TEACHERS]: {
    title: 'Teachers',
    description: 'Teacher management',
    icon: 'GraduationCap',
    requiresAuth: true
  },
  [PROTECTED_ROUTES.WORKSHOPS]: {
    title: 'Workshops',
    description: 'Workshop management',
    icon: 'Calendar',
    requiresAuth: true
  },
  [PROTECTED_ROUTES.COURSES]: {
    title: 'Courses',
    description: 'Course management',
    icon: 'BookOpen',
    requiresAuth: true
  },
  [PROTECTED_ROUTES.CONTENT]: {
    title: 'Content',
    description: 'Content management',
    icon: 'FileText',
    requiresAuth: true
  }
} as const

// Breadcrumb configuration
export const BREADCRUMB_CONFIG = {
  [PROTECTED_ROUTES.DASHBOARD]: ['Dashboard'],
  [PROTECTED_ROUTES.STUDENTS]: ['Dashboard', 'Students'],
  [PROTECTED_ROUTES.TEACHERS]: ['Dashboard', 'Teachers'],
  [PROTECTED_ROUTES.WORKSHOPS]: ['Dashboard', 'Workshops'],
  [PROTECTED_ROUTES.COURSES]: ['Dashboard', 'Courses'],
  [PROTECTED_ROUTES.CONTENT]: ['Dashboard', 'Content']
} as const

// Route types
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES]
export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES]
export type AllRoute = typeof ALL_ROUTES[keyof typeof ALL_ROUTES]