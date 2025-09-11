import { METRIC_COLORS, TREND_DIRECTIONS, TREND_PERIODS } from '@/constants/dashboard'

// Trend data interface
export interface TrendData {
  percentage: number
  period: typeof TREND_PERIODS[keyof typeof TREND_PERIODS]
  direction: typeof TREND_DIRECTIONS[keyof typeof TREND_DIRECTIONS]
}

// Metric card interface
export interface MetricCard {
  id: string
  title: string
  value: number
  trend: TrendData
  icon: React.ComponentType<{ className?: string }>
  color: typeof METRIC_COLORS[keyof typeof METRIC_COLORS]
  loading?: boolean
  error?: string
}

// Dashboard metrics data interface
export interface DashboardMetricsData {
  total_students: number
  total_teachers: number
  active_workshops: number
  total_courses: number
  today_workshops: number
  pending_enrollments: number
}

// Dashboard trends data interface
export interface DashboardTrendsData {
  total_students_trend: TrendData
  total_teachers_trend: TrendData
  active_workshops_trend: TrendData
  total_courses_trend: TrendData
  today_workshops_trend: TrendData
  pending_enrollments_trend: TrendData
}

// Complete dashboard data interface
export interface DashboardData {
  metrics: DashboardMetricsData
  trends: DashboardTrendsData
  lastUpdated: string
}

// Quick action interface
export interface QuickAction {
  id: string
  label: string
  route: string
  icon: React.ComponentType<{ className?: string }>
  color: typeof METRIC_COLORS[keyof typeof METRIC_COLORS]
}

// Dashboard component props
export interface DashboardMetricsProps {
  data?: DashboardData
  loading?: boolean
  error?: string
  onRefresh?: () => void
  className?: string
}

// Metric card component props
export interface MetricCardProps {
  card: MetricCard
  className?: string
}

// Quick actions component props
export interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
}

// Loading skeleton props
export interface LoadingSkeletonProps {
  count?: number
  className?: string
}

// Error boundary props
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

// Dashboard state interface
export interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  lastRefresh: Date | null
}

// Dashboard actions interface
export interface DashboardActions {
  refresh: () => Promise<void>
  resetError: () => void
}

// Supabase query result interface
export interface SupabaseQueryResult<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Real-time subscription interface
export interface RealtimeSubscription {
  unsubscribe: () => void
}

// Dashboard API response interface
export interface DashboardApiResponse {
  success: boolean
  data?: DashboardData
  error?: string
  timestamp: string
}

// Today's workshop interface
export interface TodayWorkshop {
  id: string
  title: string
  startTime: Date
  endTime: Date
  teacherName: string
  enrolledCount: number
  capacity: number
  attendanceMarked: boolean
  location: string
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  alerts: WorkshopAlert[]
}

// Workshop alert interface
export interface WorkshopAlert {
  id: string
  type: 'teacher_unavailable' | 'workshop_full' | 'low_enrollment' | 'missing_content'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
}

// Weekly activity interface
export interface WeeklyActivity {
  newStudents: number
  completedCourses: number
  uploadedContent: number
  scheduledWorkshops: number
  weeklyTrend: {
    students: number
    courses: number
    content: number
    workshops: number
  }
}

// Today's overview data interface
export interface TodayOverviewData {
  workshops: TodayWorkshop[]
  totalWorkshops: number
  activeWorkshops: number
  completedWorkshops: number
  totalEnrollments: number
  averageAttendance: number
  alerts: WorkshopAlert[]
  lastUpdated: string
}

// Weekly view data interface
export interface WeeklyViewData {
  activities: WeeklyActivity
  upcomingDeadlines: {
    id: string
    title: string
    dueDate: Date
    type: 'workshop' | 'course' | 'content' | 'enrollment'
    priority: 'low' | 'medium' | 'high'
  }[]
  milestones: {
    id: string
    title: string
    description: string
    achievedDate: Date
    type: 'course_completion' | 'workshop_completion' | 'content_upload'
  }[]
  lastUpdated: string
}

// Complete dashboard overview interface
export interface DashboardOverviewData {
  today: TodayOverviewData
  weekly: WeeklyViewData
  lastUpdated: string
}

// Today's overview component props
export interface TodayOverviewProps {
  data?: TodayOverviewData
  loading?: boolean
  error?: string
  onRefresh?: () => void
}

// Weekly view component props
export interface WeeklyViewProps {
  data?: WeeklyViewData
  loading?: boolean
  error?: string
  onRefresh?: () => void
}

// Workshop card props
export interface WorkshopCardProps {
  workshop: TodayWorkshop
  className?: string
}

// Alert badge props
export interface AlertBadgeProps {
  alert: WorkshopAlert
  className?: string
}
