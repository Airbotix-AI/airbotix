import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, FileText, Video, Link } from 'lucide-react'
import { APP_STRINGS } from '@/constants/strings'
import { Content as ContentType } from '@/types'
import { formatDate } from '@/utils'

// Mock data - In a real app, this would come from an API
const mockContent: ContentType[] = [
  {
    id: '1',
    title: 'Getting Started with Robotics',
    type: 'article',
    content_data: {
      body: 'A comprehensive guide to beginning your journey in robotics...',
      metadata: { reading_time: '5 min' }
    },
    author_id: 'teacher_1',
    author_name: 'Dr. Alice Wilson',
    status: 'published',
    tags: ['robotics', 'beginner', 'guide'],
    featured: true,
    published_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'AI Workshop Introduction Video',
    type: 'video',
    content_data: {
      video_url: 'https://example.com/video/ai-intro',
      metadata: { duration: '15 min', resolution: '1080p' }
    },
    author_id: 'teacher_2',
    author_name: 'Prof. Bob Chen',
    status: 'published',
    tags: ['ai', 'video', 'workshop'],
    featured: false,
    published_at: '2024-01-12T14:30:00Z',
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-12T14:30:00Z',
  },
  {
    id: '3',
    title: 'Python Programming Tutorial Series',
    type: 'tutorial',
    content_data: {
      body: 'Step-by-step tutorial for learning Python programming...',
      attachments: ['code-examples.zip', 'exercises.pdf'],
      metadata: { difficulty: 'intermediate', chapters: 12 }
    },
    author_id: 'teacher_2',
    author_name: 'Prof. Bob Chen',
    status: 'draft',
    tags: ['python', 'programming', 'tutorial'],
    featured: false,
    created_at: '2024-01-20T16:00:00Z',
    updated_at: '2024-01-20T16:00:00Z',
  },
  {
    id: '4',
    title: 'New Course Announcement: Machine Learning',
    type: 'announcement',
    content_data: {
      body: 'We are excited to announce our new Machine Learning course...',
      metadata: { priority: 'high' }
    },
    author_id: 'admin_1',
    author_name: 'Admin User',
    status: 'review',
    tags: ['announcement', 'course', 'machine-learning'],
    featured: true,
    created_at: '2024-01-22T09:30:00Z',
    updated_at: '2024-01-22T09:30:00Z',
  },
]

export default function Content() {
  const [content] = useState<ContentType[]>(mockContent)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // In a real app, fetch content data from API
    setLoading(false)
  }, [])

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'status-active',
      draft: 'status-pending',
      review: 'status-pending',
      archived: 'status-inactive',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-inactive'
  }

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      published: APP_STRINGS.STATUS_PUBLISHED,
      draft: APP_STRINGS.STATUS_DRAFT,
      review: 'Under Review',
      archived: 'Archived',
    }
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      article: FileText,
      video: Video,
      tutorial: FileText,
      resource: Link,
      announcement: FileText,
    }
    return typeIcons[type as keyof typeof typeIcons] || FileText
  }

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      article: 'Article',
      video: 'Video',
      tutorial: 'Tutorial',
      resource: 'Resource',
      announcement: 'Announcement',
    }
    return typeLabels[type as keyof typeof typeLabels] || type
  }

  const getTypeBadge = (type: string) => {
    const typeBadges = {
      article: 'bg-blue-100 text-blue-800',
      video: 'bg-purple-100 text-purple-800',
      tutorial: 'bg-green-100 text-green-800',
      resource: 'bg-orange-100 text-orange-800',
      announcement: 'bg-red-100 text-red-800',
    }
    return typeBadges[type as keyof typeof typeBadges] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">{APP_STRINGS.CONTENT_TITLE}</h1>
          <p className="mt-2 text-gray-600">Create and manage educational content</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{APP_STRINGS.CONTENT_ADD_NEW}</span>
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
                placeholder={APP_STRINGS.CONTENT_SEARCH_PLACEHOLDER}
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
              <option value="review">Under Review</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Types</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="tutorial">Tutorial</option>
              <option value="resource">Resource</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <button className="btn-outline flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_TITLE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_TYPE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_AUTHOR}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_STATUS}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_DATE}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {APP_STRINGS.CONTENT_TABLE_ACTIONS}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                return (
                  <tr key={item.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {item.title}
                            {item.featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.author_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.published_at ? formatDate(item.published_at) : formatDate(item.created_at)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.published_at ? 'Published' : 'Created'}
                      </div>
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

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first content piece.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
