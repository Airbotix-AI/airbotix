export const PERMISSIONS = {
  // Global permissions
  ALL: 'all',
  
  // Student management
  MANAGE_STUDENTS: 'manage_students',
  VIEW_STUDENTS: 'view_students',
  CREATE_STUDENTS: 'create_students',
  EDIT_STUDENTS: 'edit_students',
  DELETE_STUDENTS: 'delete_students',
  
  // Teacher management
  MANAGE_TEACHERS: 'manage_teachers',
  VIEW_TEACHERS: 'view_teachers',
  CREATE_TEACHERS: 'create_teachers',
  EDIT_TEACHERS: 'edit_teachers',
  DELETE_TEACHERS: 'delete_teachers',
  
  // Workshop management
  MANAGE_WORKSHOPS: 'manage_workshops',
  VIEW_WORKSHOPS: 'view_workshops',
  CREATE_WORKSHOPS: 'create_workshops',
  EDIT_WORKSHOPS: 'edit_workshops',
  DELETE_WORKSHOPS: 'delete_workshops',
  VIEW_ASSIGNED_WORKSHOPS: 'view_assigned_workshops',
  MARK_ATTENDANCE: 'mark_attendance',
  
  // Course management
  MANAGE_COURSES: 'manage_courses',
  VIEW_COURSES: 'view_courses',
  CREATE_COURSES: 'create_courses',
  EDIT_COURSES: 'edit_courses',
  DELETE_COURSES: 'delete_courses',
  
  // Content management
  MANAGE_CONTENT: 'manage_content',
  VIEW_CONTENT: 'view_content',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  
  // User management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  ASSIGN_ROLES: 'assign_roles',
  
  // Dashboard and analytics
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [PERMISSIONS.ALL],
  admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.MANAGE_TEACHERS,
    PERMISSIONS.MANAGE_WORKSHOPS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EXPORT_DATA,
  ],
  teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_WORKSHOPS,
    PERMISSIONS.VIEW_ASSIGNED_WORKSHOPS,
    PERMISSIONS.MARK_ATTENDANCE,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_CONTENT,
  ],
}
