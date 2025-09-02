import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, BookOpen, Clock, DollarSign } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { Course } from '@/types'
import { formatCurrency } from '@/utils'

// Mock data - In a real app, this would come from an API
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Robotics Engineering',
    description: 'Comprehensive course covering advanced robotics concepts, control systems, and practical applications',
    category: 'robotics',
    level: 'advanced',
    duration_weeks: 12,
    price: 1299,
    instructor_id: 'teacher_1',
    instructor_name: 'Dr. Alice Wilson',
    status: 'published',
    max_students: 30,
    enrolled_count: 28,
    syllabus: [
      {
        week: 1,
        title: 'Introduction to Advanced Robotics',
        description: 'Overview of robotics systems and applications',
        learning_objectives: ['Understand robot components', 'Learn control basics'],
        materials: ['Textbook Chapter 1', 'Lab Kit']
      },
    ],
    prerequisites: ['Basic Programming', 'Mathematics'],
    thumbnail_url: '/images/robotics-course.jpg',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Learn the basics of machine learning algorithms and their applications',
    category: 'ai',
    level: 'intermediate',
    duration_weeks: 8,
    price: 899,
    instructor_id: 'teacher_2',
    instructor_name: 'Prof. Bob Chen',
    status: 'published',
    max_students: 40,
    enrolled_count: 35,
    prerequisites: ['Python Programming'],
    created_at: '2023-12-15T10:00:00Z',
    updated_at: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    title: 'STEM Education for Kids',
    description: 'Interactive STEM learning program designed for young learners',
    category: 'stem',
    level: 'beginner',
    duration_weeks: 6,
    price: 399,
    instructor_id: 'teacher_3',
    instructor_name: 'Dr. Carol Martinez',
    status: 'draft',
    max_students: 25,
    enrolled_count: 0,
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z',
  },
]

export default function Courses() {
  const [courses] = useState<Course[]>(mockCourses)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    // In a real app, fetch courses data from API
    setLoading(false)
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'status-active',
      draft: 'status-pending',
      archived: 'status-inactive',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-inactive'
  }

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      published: APP_STRINGS.STATUS_PUBLISHED,
      draft: APP_STRINGS.STATUS_DRAFT,
      archived: 'Archived',
    }
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  const getLevelBadge = (level: string) => {
    const levelClasses = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    }
    return levelClasses[level as keyof typeof levelClasses] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      robotics: 'Robotics',
      programming: 'Programming',
      ai: 'Artificial Intelligence',
      stem: 'STEM',
      engineering: 'Engineering',
    }
    return categoryLabels[category as keyof typeof categoryLabels] || category
  }

  const getEnrollmentStatus = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 100) return { color: 'text-red-600', label: 'Full' }
    if (percentage >= 80) return { color: 'text-orange-600', label: 'Almost Full' }
    return { color: 'text-green-600', label: 'Available' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.COURSES_TITLE}</h1>
          <p className="mt-2 text-gray-600">Create and manage educational courses</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{APP_STRINGS.COURSES_ADD_NEW}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={APP_STRINGS.COURSES_SEARCH_PLACEHOLDER}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="published">{APP_STRINGS.STATUS_PUBLISHED}</option>
              <option value="draft">{APP_STRINGS.STATUS_DRAFT}</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Categories</option>
              <option value="robotics">Robotics</option>
              <option value="programming">Programming</option>
              <option value="ai">AI</option>
              <option value="stem">STEM</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_TITLE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_CATEGORY}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_DURATION}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_PRICE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_STATUS}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.COURSES_TABLE_ACTIONS}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => {
                const enrollmentStatus = getEnrollmentStatus(course.enrolled_count, course.max_students)
                return (
                  <tr key={course.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(course.level)}`}>
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryLabel(course.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {course.duration_weeks} weeks
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.enrolled_count}/{course.max_students}
                      </div>
                      <div className={`text-xs ${enrollmentStatus.color} font-medium`}>
                        {enrollmentStatus.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {formatCurrency(course.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(course.status)}>
                        {getStatusLabel(course.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary hover:text-primary/80">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first course.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
