import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText 
} from 'lucide-react'

// Navigation routes
export const NAVIGATION_ROUTES = {
  DASHBOARD: '/admin',
  STUDENTS: '/admin/students',
  TEACHERS: '/admin/teachers',
  WORKSHOPS: '/admin/workshops',
  COURSES: '/admin/courses',
  CONTENT: '/admin/content'
} as const

// Navigation labels in Chinese as per PRD
export const NAVIGATION_LABELS = {
  DASHBOARD: 'Dashboard',
  STUDENTS: 'Students',
  TEACHERS: 'Teachers',
  WORKSHOPS: 'Workshops',
  COURSES: 'Courses',
  CONTENT: 'Content Management'
} as const

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher'
} as const

// Role display labels
export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.TEACHER]: 'Teacher'
} as const

// Navigation item interface
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRoles: string[]
}

// Navigation items configuration
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: NAVIGATION_LABELS.DASHBOARD,
    href: NAVIGATION_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  },
  {
    id: 'students',
    label: NAVIGATION_LABELS.STUDENTS,
    href: NAVIGATION_ROUTES.STUDENTS,
    icon: Users,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  },
  {
    id: 'teachers',
    label: NAVIGATION_LABELS.TEACHERS,
    href: NAVIGATION_ROUTES.TEACHERS,
    icon: GraduationCap,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
  },
  {
    id: 'workshops',
    label: NAVIGATION_LABELS.WORKSHOPS,
    href: NAVIGATION_ROUTES.WORKSHOPS,
    icon: Calendar,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  },
  {
    id: 'courses',
    label: NAVIGATION_LABELS.COURSES,
    href: NAVIGATION_ROUTES.COURSES,
    icon: BookOpen,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  },
  {
    id: 'content',
    label: NAVIGATION_LABELS.CONTENT,
    href: NAVIGATION_ROUTES.CONTENT,
    icon: FileText,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  }
] as const

// Sidebar configuration
export const SIDEBAR_CONFIG = {
  WIDTH: 280,
  COLLAPSED_WIDTH: 80,
  TRANSITION_DURATION: 300
} as const
