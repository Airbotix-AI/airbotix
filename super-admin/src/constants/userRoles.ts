export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const ROLE_HIERARCHY = {
  [USER_ROLES.SUPER_ADMIN]: 3,
  [USER_ROLES.ADMIN]: 2,
  [USER_ROLES.TEACHER]: 1
} as const
