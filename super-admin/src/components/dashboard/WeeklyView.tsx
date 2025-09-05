import React, { useState } from 'react'
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Upload, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { 
  WeeklyViewProps, 
  WeeklyActivity,
  WeeklyViewData 
} from '@/types/dashboard'
import { cn } from '@/utils'

// Activity metric card component
const ActivityMetricCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color 
}: {
  title: string
  value: number
  trend: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) => {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {getTrendIcon()}
            <span className={cn("text-sm font-medium ml-1", getTrendColor())}>
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>
        <div className={cn("p-3 rounded-lg", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

// Deadline item component
const DeadlineItem = ({ 
  deadline 
}: { 
  deadline: {
    id: string
    title: string
    dueDate: Date
    type: 'workshop' | 'course' | 'content' | 'enrollment'
    priority: 'low' | 'medium' | 'high'
  }
}) => {
  const getPriorityColor = () => {
    switch (deadline.priority) {
      case 'high':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getTypeIcon = () => {
    switch (deadline.type) {
      case 'workshop':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'course':
        return <BookOpen className="h-4 w-4 text-green-600" />
      case 'content':
        return <Upload className="h-4 w-4 text-purple-600" />
      case 'enrollment':
        return <Users className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
      getPriorityColor()
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getTypeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{deadline.title}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Due: {formatDate(deadline.dueDate)}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
            deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          )}>
            {deadline.priority}
          </span>
        </div>
      </div>
    </div>
  )
}

// Milestone item component
const MilestoneItem = ({ 
  milestone 
}: { 
  milestone: {
    id: string
    title: string
    description: string
    achievedDate: Date
    type: 'course_completion' | 'workshop_completion' | 'content_upload'
  }
}) => {
  const getTypeIcon = () => {
    switch (milestone.type) {
      case 'course_completion':
        return <BookOpen className="h-4 w-4 text-green-600" />
      case 'workshop_completion':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'content_upload':
        return <Upload className="h-4 w-4 text-purple-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            {getTypeIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{milestone.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            Achieved: {formatDate(milestone.achievedDate)}
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-6 bg-gray-100 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  </div>
)

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Error loading weekly view</h3>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-4 inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </button>
    </div>
  </div>
)

// Main WeeklyView component
export default function WeeklyView({ 
  data, 
  loading = false, 
  error, 
  onRefresh 
}: WeeklyViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Weekly View</h2>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Weekly View</h2>
        </div>
        <ErrorState error={error} onRetry={handleRefresh} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Weekly View</h2>
        </div>
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  const { activities, upcomingDeadlines, milestones } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Weekly View</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data.lastUpdated ? `Last updated: ${new Date(data.lastUpdated).toLocaleString()}` : 'Real-time data'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Weekly Activity Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActivityMetricCard
            title="New Students"
            value={activities.newStudents}
            trend={activities.weeklyTrend.students}
            icon={Users}
            color="bg-blue-500"
          />
          <ActivityMetricCard
            title="Completed Courses"
            value={activities.completedCourses}
            trend={activities.weeklyTrend.courses}
            icon={BookOpen}
            color="bg-green-500"
          />
          <ActivityMetricCard
            title="Uploaded Content"
            value={activities.uploadedContent}
            trend={activities.weeklyTrend.content}
            icon={Upload}
            color="bg-purple-500"
          />
          <ActivityMetricCard
            title="Scheduled Workshops"
            value={activities.scheduledWorkshops}
            trend={activities.weeklyTrend.workshops}
            icon={Calendar}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Upcoming Deadlines and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <DeadlineItem key={deadline.id} deadline={deadline} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Milestones */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
          {milestones.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No recent milestones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <MilestoneItem key={milestone.id} milestone={milestone} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export types for external use
export type { WeeklyViewProps, WeeklyActivity, WeeklyViewData }
