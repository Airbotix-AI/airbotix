// UI constants following AI coding rules
export const USER_MENU_ITEMS = {
  PROFILE: 'profile',
  SETTINGS: 'settings',
  LOGOUT: 'logout'
} as const

export const NOTIFICATION_TYPES = {
  NEW_ENROLLMENT: 'new_enrollment',
  WORKSHOP_REMINDER: 'workshop_reminder',
  SYSTEM_UPDATE: 'system_update',
  COURSE_COMPLETION: 'course_completion',
  TEACHER_ASSIGNMENT: 'teacher_assignment'
} as const

export const UI_TEXT = {
  MY_ACCOUNT: 'My Account',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGOUT: 'Log out',
  NOTIFICATIONS: 'Notifications',
  SIGN_OUT: 'Sign Out',
  SIDEBAR_SETTINGS: 'Settings',
  CONFIRM_LOGOUT: 'Are you sure you want to sign out?',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm'
} as const

export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 'sm',
  TABLET: 'md',
  DESKTOP: 'lg'
} as const

export const NOTIFICATION_CONFIG = {
  MAX_DISPLAY_COUNT: 99,
  COUNT_THRESHOLD: 0,
  AUTO_HIDE_DELAY: 5000
} as const

// Export types for external use
export type UserMenuItem = typeof USER_MENU_ITEMS[keyof typeof USER_MENU_ITEMS]
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]
