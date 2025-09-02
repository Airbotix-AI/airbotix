import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, GraduationCap } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { Teacher } from '@/types'
import { formatDate } from '@/utils'

// Mock data - In a real app, this would come from an API
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Alice Wilson',
    email: 'alice.wilson@airbotix.com',
    phone: '+1 (555) 987-6543',
    bio: 'PhD in Robotics Engineering with 10 years of teaching experience',
    specializations: ['Robotics', 'AI', 'Machine Learning'],
    status: 'active',
    courses_teaching: ['course_1', 'course_2'],
    workshops_conducted: ['workshop_1', 'workshop_3'],
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z',
  },
  {
    id: '2',
    name: 'Prof. Bob Chen',
    email: 'bob.chen@airbotix.com',
    phone: '+1 (555) 876-5432',
    bio: 'Software Engineering expert specializing in educational technology',
    specializations: ['Programming', 'Software Engineering', 'Web Development'],
    status: 'active',
    courses_teaching: ['course_3', 'course_4'],
    workshops_conducted: ['workshop_2'],
    created_at: '2023-12-15T10:30:00Z',
    updated_at: '2023-12-15T10:30:00Z',
  },
  {
    id: '3',
    name: 'Dr. Carol Martinez',
    email: 'carol.martinez@airbotix.com',
    specializations: ['STEM Education', 'Mathematics'],
    status: 'on_leave',
    courses_teaching: [],
    workshops_conducted: [],
    created_at: '2023-11-20T14:15:00Z',
    updated_at: '2023-11-20T14:15:00Z',
  },
]

export default function Teachers() {
  const [teachers] = useState<Teacher[]>(mockTeachers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // In a real app, fetch teachers data from API
    setLoading(false)
  }, [])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specializations.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      on_leave: 'status-pending',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-inactive'
  }

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      active: APP_STRINGS.STATUS_ACTIVE,
      inactive: APP_STRINGS.STATUS_INACTIVE,
      on_leave: 'On Leave',
    }
    return statusLabels[status as keyof typeof statusLabels] || status
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
          <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.TEACHERS_TITLE}</h1>
          <p className="mt-2 text-gray-600">Manage instructors and teaching staff</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{APP_STRINGS.TEACHERS_ADD_NEW}</span>
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
                placeholder={APP_STRINGS.TEACHERS_SEARCH_PLACEHOLDER}
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
              <option value="active">{APP_STRINGS.STATUS_ACTIVE}</option>
              <option value="inactive">{APP_STRINGS.STATUS_INACTIVE}</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.TEACHERS_TABLE_NAME}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.TEACHERS_TABLE_EMAIL}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specializations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.TEACHERS_TABLE_STATUS}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.TEACHERS_TABLE_ACTIONS}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        {teacher.phone && (
                          <div className="text-sm text-gray-500">{teacher.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.specializations.slice(0, 2).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {spec}
                        </span>
                      ))}
                      {teacher.specializations.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{teacher.specializations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {teacher.courses_teaching.length} active
                    </div>
                    <div className="text-sm text-gray-500">
                      {teacher.workshops_conducted.length} workshops
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(teacher.status)}>
                      {getStatusLabel(teacher.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(teacher.created_at)}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
