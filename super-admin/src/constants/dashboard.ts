import { 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Clock, 
  UserPlus 
} from 'lucide-react'

// Metric types as per PRD requirements
export const METRIC_TYPES = {
  STUDENTS: 'total_students',
  TEACHERS: 'total_teachers',
  WORKSHOPS: 'active_workshops',
  COURSES: 'total_courses',
  TODAY_WORKSHOPS: 'today_workshops',
  PENDING_ENROLLMENTS: 'pending_enrollments'
} as const

// Quick action labels
export const QUICK_ACTION_LABELS = {
  ADD_STUDENT: 'Add Student',
  CREATE_WORKSHOP: 'Create Workshop',
  UPLOAD_CONTENT: 'Upload Content',
  ASSIGN_TEACHER: 'Assign Teacher'
} as const

// Quick action routes
export const QUICK_ACTION_ROUTES = {
  ADD_STUDENT: '/admin/students',
  CREATE_WORKSHOP: '/admin/workshops',
  UPLOAD_CONTENT: '/admin/content',
  ASSIGN_TEACHER: '/admin/teachers'
} as const

// Metric card colors
export const METRIC_COLORS = {
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange'
} as const

// Trend directions
export const TREND_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral'
} as const

// Trend periods
export const TREND_PERIODS = {
  WEEK: 'week',
  MONTH: 'month'
} as const

// Primary metrics configuration
export const PRIMARY_METRICS = [
  {
    id: METRIC_TYPES.STUDENTS,
    title: 'Total Students',
    icon: Users,
    color: METRIC_COLORS.BLUE,
    trendPeriod: TREND_PERIODS.MONTH
  },
  {
    id: METRIC_TYPES.TEACHERS,
    title: 'Total Teachers',
    icon: GraduationCap,
    color: METRIC_COLORS.GREEN,
    trendPeriod: TREND_PERIODS.MONTH
  },
  {
    id: METRIC_TYPES.WORKSHOPS,
    title: 'Active Workshops',
    icon: Calendar,
    color: METRIC_COLORS.PURPLE,
    trendPeriod: TREND_PERIODS.WEEK
  },
  {
    id: METRIC_TYPES.COURSES,
    title: 'Total Courses',
    icon: BookOpen,
    color: METRIC_COLORS.ORANGE,
    trendPeriod: TREND_PERIODS.MONTH
  }
] as const

// Secondary metrics configuration
export const SECONDARY_METRICS = [
  {
    id: METRIC_TYPES.TODAY_WORKSHOPS,
    title: "Today's Workshops",
    icon: Clock,
    color: METRIC_COLORS.BLUE,
    trendPeriod: TREND_PERIODS.WEEK
  },
  {
    id: METRIC_TYPES.PENDING_ENROLLMENTS,
    title: 'Pending Enrollments',
    icon: UserPlus,
    color: METRIC_COLORS.GREEN,
    trendPeriod: TREND_PERIODS.WEEK
  }
] as const

// Quick actions configuration
export const QUICK_ACTIONS = [
  {
    id: 'add_student',
    label: QUICK_ACTION_LABELS.ADD_STUDENT,
    route: QUICK_ACTION_ROUTES.ADD_STUDENT,
    icon: Users,
    color: METRIC_COLORS.BLUE
  },
  {
    id: 'create_workshop',
    label: QUICK_ACTION_LABELS.CREATE_WORKSHOP,
    route: QUICK_ACTION_ROUTES.CREATE_WORKSHOP,
    icon: Calendar,
    color: METRIC_COLORS.PURPLE
  },
  {
    id: 'upload_content',
    label: QUICK_ACTION_LABELS.UPLOAD_CONTENT,
    route: QUICK_ACTION_ROUTES.UPLOAD_CONTENT,
    icon: BookOpen,
    color: METRIC_COLORS.ORANGE
  },
  {
    id: 'assign_teacher',
    label: QUICK_ACTION_LABELS.ASSIGN_TEACHER,
    route: QUICK_ACTION_ROUTES.ASSIGN_TEACHER,
    icon: GraduationCap,
    color: METRIC_COLORS.GREEN
  }
] as const

// Workshop status types
export const WORKSHOP_STATUS = {
  UPCOMING: 'upcoming',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

// Alert types
export const ALERT_TYPES = {
  TEACHER_UNAVAILABLE: 'teacher_unavailable',
  WORKSHOP_FULL: 'workshop_full',
  LOW_ENROLLMENT: 'low_enrollment',
  MISSING_CONTENT: 'missing_content'
} as const

// Time formatting constants
export const TIME_FORMATS = {
  TIME_ONLY: 'HH:mm',
  DATE_TIME: 'MMM dd, yyyy HH:mm',
  DATE_ONLY: 'MMM dd, yyyy',
  RELATIVE: 'relative'
} as const

// Capacity thresholds
export const CAPACITY_THRESHOLDS = {
  LOW_ENROLLMENT: 0.3,    // 30% capacity
  NEAR_FULL: 0.8,         // 80% capacity
  OVERBOOKED: 1.0         // 100% capacity
} as const

// Dashboard configuration
export const DASHBOARD_CONFIG = {
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 4
  },
  SECONDARY_GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 2
  },
  CARD_ANIMATION_DURATION: 200,
  LOADING_SKELETON_COUNT: 4,
  REFRESH_INTERVAL: 30000,  // 30 seconds
  MAX_WORKSHOPS_DISPLAY: 10
} as const
