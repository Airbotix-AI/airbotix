import { useState, useEffect } from 'react'
import { Users, GraduationCap, Calendar, BookOpen, TrendingUp, Activity } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { DashboardStats, DashboardActivity } from '@/types'
import { formatNumber, formatCurrency } from '@/utils'

// Mock data - In a real app, this would come from an API
const mockStats: DashboardStats = {
  total_students: 1247,
  total_teachers: 89,
  active_workshops: 23,
  total_courses: 156,
  revenue_this_month: 45780,
  new_enrollments_this_week: 34,
}

const mockActivities: DashboardActivity[] = [
  {
    id: '1',
    type: 'student_enrolled',
    description: 'John Doe enrolled in Advanced Robotics Course',
    user_id: 'user_1',
    user_name: 'John Doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    type: 'workshop_completed',
    description: 'AI Fundamentals Workshop completed successfully',
    user_id: 'user_2',
    user_name: 'Sarah Smith',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: '3',
    type: 'course_created',
    description: 'New course "Machine Learning Basics" was created',
    user_id: 'user_3',
    user_name: 'Dr. Wilson',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: '4',
    type: 'user_registered',
    description: 'Emily Johnson registered as a new student',
    user_id: 'user_4',
    user_name: 'Emily Johnson',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
]

const statCards = [
  {
    title: APP_STRINGS.DASHBOARD_STATS_STUDENTS,
    value: mockStats.total_students,
    icon: Users,
    color: 'bg-blue-500',
    change: '+12%',
    changeType: 'positive' as const,
  },
  {
    title: APP_STRINGS.DASHBOARD_STATS_TEACHERS,
    value: mockStats.total_teachers,
    icon: GraduationCap,
    color: 'bg-green-500',
    change: '+8%',
    changeType: 'positive' as const,
  },
  {
    title: APP_STRINGS.DASHBOARD_STATS_WORKSHOPS,
    value: mockStats.active_workshops,
    icon: Calendar,
    color: 'bg-purple-500',
    change: '+15%',
    changeType: 'positive' as const,
  },
  {
    title: APP_STRINGS.DASHBOARD_STATS_COURSES,
    value: mockStats.total_courses,
    icon: BookOpen,
    color: 'bg-orange-500',
    change: '+5%',
    changeType: 'positive' as const,
  },
]

export default function Dashboard() {
  const [stats] = useState<DashboardStats>(mockStats)
  const [activities] = useState<DashboardActivity[]>(mockActivities)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In a real app, fetch dashboard data from API
    setLoading(false)
  }, [])

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMs = now.getTime() - time.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.DASHBOARD_TITLE}</h1>
        <p className="mt-2 text-gray-600">{APP_STRINGS.DASHBOARD_WELCOME}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(card.value)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue This Month</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.revenue_this_month)}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+18%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">New Enrollments This Week</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatNumber(stats.new_enrollments_this_week)}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+23%</span>
            <span className="text-sm text-gray-500 ml-1">from last week</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user_name} • {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
