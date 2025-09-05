import { NAVIGATION_ROUTES } from './navigation'

// Search placeholders based on current page context
export const SEARCH_PLACEHOLDERS = {
  DASHBOARD: 'Search students, teachers, workshops...',
  STUDENTS: 'Search student name, school...',
  TEACHERS: 'Search teacher name, subject...',
  WORKSHOPS: 'Search workshop title, location...',
  COURSES: 'Search course name, category...',
  CONTENT: 'Search content title, tags...'
} as const

// User menu actions
export const USER_MENU_ACTIONS = {
  PROFILE: 'profile',
  SETTINGS: 'settings',
  LOGOUT: 'logout'
} as const

// Search context mapping based on routes
export const SEARCH_CONTEXT_MAP = {
  [NAVIGATION_ROUTES.DASHBOARD]: SEARCH_PLACEHOLDERS.DASHBOARD,
  [NAVIGATION_ROUTES.STUDENTS]: SEARCH_PLACEHOLDERS.STUDENTS,
  [NAVIGATION_ROUTES.TEACHERS]: SEARCH_PLACEHOLDERS.TEACHERS,
  [NAVIGATION_ROUTES.WORKSHOPS]: SEARCH_PLACEHOLDERS.WORKSHOPS,
  [NAVIGATION_ROUTES.COURSES]: SEARCH_PLACEHOLDERS.COURSES,
  [NAVIGATION_ROUTES.CONTENT]: SEARCH_PLACEHOLDERS.CONTENT
} as const

// Search configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100
} as const

// Notification configuration
export const NOTIFICATION_CONFIG = {
  MAX_COUNT_DISPLAY: 99,
  COUNT_THRESHOLD: 0
} as const

// Top navigation configuration
export const TOP_NAV_CONFIG = {
  HEIGHT: 64, // 16 * 4 = 64px
  Z_INDEX: 40,
  TRANSITION_DURATION: 200
} as const
