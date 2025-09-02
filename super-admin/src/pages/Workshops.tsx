import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { Workshop } from '@/types'
import { formatDate, formatTime, formatCurrency } from '@/utils'

// Mock data - In a real app, this would come from an API
const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Introduction to Robotics',
    description: 'Learn the basics of robotics and automation',
    instructor_id: 'teacher_1',
    instructor_name: 'Dr. Alice Wilson',
    date: '2024-02-15',
    start_time: '10:00',
    end_time: '12:00',
    capacity: 20,
    enrolled_count: 18,
    price: 150,
    location: 'Lab A - Building 1',
    status: 'scheduled',
    materials: ['Robotics Kit', 'Laptop', 'Safety Goggles'],
    requirements: ['Basic programming knowledge'],
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: 'AI for Beginners',
    description: 'Understanding artificial intelligence fundamentals',
    instructor_id: 'teacher_2',
    instructor_name: 'Prof. Bob Chen',
    date: '2024-02-20',
    start_time: '14:00',
    end_time: '16:30',
    capacity: 25,
    enrolled_count: 12,
    price: 200,
    location: 'Conference Room B',
    status: 'scheduled',
    materials: ['Presentation Materials', 'Code Examples'],
    created_at: '2024-01-10T11:30:00Z',
    updated_at: '2024-01-10T11:30:00Z',
  },
  {
    id: '3',
    title: 'Advanced Machine Learning',
    description: 'Deep dive into ML algorithms and applications',
    instructor_id: 'teacher_1',
    instructor_name: 'Dr. Alice Wilson',
    date: '2024-01-30',
    start_time: '09:00',
    end_time: '17:00',
    capacity: 15,
    enrolled_count: 15,
    price: 350,
    location: 'Lab C - Building 2',
    status: 'completed',
    materials: ['Dataset', 'GPU Access', 'Reference Materials'],
    requirements: ['Python programming', 'Statistics knowledge'],
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-30T17:00:00Z',
  },
]

export default function Workshops() {
  const [workshops] = useState<Workshop[]>(mockWorkshops)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // In a real app, fetch workshops data from API
    setLoading(false)
  }, [])

  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || workshop.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      scheduled: 'status-pending',
      ongoing: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-inactive'
  }

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      scheduled: 'Scheduled',
      ongoing: 'Ongoing',
      completed: APP_STRINGS.STATUS_COMPLETED,
      cancelled: APP_STRINGS.STATUS_CANCELLED,
    }
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  const getCapacityStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100
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
          <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.WORKSHOPS_TITLE}</h1>
          <p className="mt-2 text-gray-600">Organize and manage educational workshops</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{APP_STRINGS.WORKSHOPS_ADD_NEW}</span>
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
                placeholder={APP_STRINGS.WORKSHOPS_SEARCH_PLACEHOLDER}
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
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">{APP_STRINGS.STATUS_COMPLETED}</option>
              <option value="cancelled">{APP_STRINGS.STATUS_CANCELLED}</option>
            </select>
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Workshops Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_TITLE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_DATE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_INSTRUCTOR}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_CAPACITY}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_STATUS}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.WORKSHOPS_TABLE_ACTIONS}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkshops.map((workshop) => {
                const capacityStatus = getCapacityStatus(workshop.enrolled_count, workshop.capacity)
                return (
                  <tr key={workshop.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{workshop.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {workshop.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(workshop.date)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{workshop.instructor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {workshop.enrolled_count}/{workshop.capacity}
                      </div>
                      <div className={`text-xs ${capacityStatus.color} font-medium`}>
                        {capacityStatus.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(workshop.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(workshop.status)}>
                        {getStatusLabel(workshop.status)}
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

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workshops found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first workshop.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
