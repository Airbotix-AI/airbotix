export const MODULES = {
  DASHBOARD: 'dashboard',
  STUDENTS: 'students',
  TEACHERS: 'teachers', 
  WORKSHOPS: 'workshops',
  COURSES: 'courses',
  CONTENT: 'content',
  USERS: 'users'
} as const

export const MODULE_LABELS = {
  [MODULES.DASHBOARD]: 'Dashboard',
  [MODULES.STUDENTS]: 'Student Management',
  [MODULES.TEACHERS]: 'Teacher Management',
  [MODULES.WORKSHOPS]: 'Workshop Management', 
  [MODULES.COURSES]: 'Course Management',
  [MODULES.CONTENT]: 'Content Management',
  [MODULES.USERS]: 'User Management'
} as const
