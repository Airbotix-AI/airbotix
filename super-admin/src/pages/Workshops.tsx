import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Archive,
  RotateCcw,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { useWorkshops } from '@/hooks'
import { 
  WORKSHOP_STATUS_LABELS
} from '@/constants/workshop'
import type { NewWorkshopStatus } from '@/types'

export default function Workshops() {
  const navigate = useNavigate()
  
  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState<'title' | 'startDate' | 'endDate' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Date range state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<NewWorkshopStatus | null>(null)

  // Use workshops hook
  const {
    workshops,
    total,
    page,
    limit,
    loading,
    error,
    setStatus,
    setSearch,
    setDateRange,
    setSorting,
    setPage,
    deleteWorkshop,
    archiveWorkshop,
    restoreWorkshop,
    hasMore,
    isEmpty,
    isFiltered
  } = useWorkshops({
    status: statusFilter || undefined,
    search: searchTerm || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy: sortField,
    sortOrder,
    page: 1,
    limit: 20
  })

  // Handle search with debounce
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setSearch(value)
  }, [setSearch])

  // Handle status filter
  const handleStatusFilter = useCallback((status: NewWorkshopStatus | null) => {
    setStatusFilter(status)
    setStatus(status)
  }, [setStatus])

  // Handle date range filter
  const handleDateRange = useCallback((start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    setDateRange(start, end)
  }, [setDateRange])

  // Handle sorting
  const handleSort = useCallback((field: 'title' | 'startDate' | 'endDate' | 'createdAt') => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(newOrder)
    setSorting(field, newOrder)
  }, [sortField, sortOrder, setSorting])

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [setPage])

  // Handle workshop actions
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        await deleteWorkshop(id)
        // Success handled by hook
      } catch (error) {
        console.error('Error deleting workshop:', error)
      }
    }
  }, [deleteWorkshop])

  const handleArchive = useCallback(async (id: string) => {
    try {
      await archiveWorkshop(id)
      // Success handled by hook
    } catch (error) {
      console.error('Error archiving workshop:', error)
    }
  }, [archiveWorkshop])

  const handleRestore = useCallback(async (id: string) => {
    try {
      await restoreWorkshop(id)
      // Success handled by hook
    } catch (error) {
      console.error('Error restoring workshop:', error)
    }
  }, [restoreWorkshop])

  // Handle edit
  const handleEdit = useCallback((id: string) => {
    navigate(`/admin/workshops/${id}/edit`)
  }, [navigate])

  // Get status badge styling
  const getStatusBadge = (status: NewWorkshopStatus) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    }
    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }

  // Format date for display
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get sort icon
  const getSortIcon = (field: 'title' | 'startDate' | 'endDate' | 'createdAt') => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">Workshop Management</h1>
          <p className="mt-2 text-gray-600">Manage and organize educational workshops</p>
          {total > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {total} workshop{total !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 ${viewMode === 'card' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}
              title="Card view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
          
          {/* Add Workshop Button */}
          <button 
            onClick={() => navigate('/admin/workshops/new')}
            className="btn-primary flex items-center space-x-2"
            title="Create new workshop"
          >
            <Plus className="h-4 w-4" />
            <span>Add Workshop</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops by title, overview, or target audience..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter || 'all'}
              onChange={(e) => handleStatusFilter(e.target.value === 'all' ? null : e.target.value as NewWorkshopStatus)}
              className="form-input"
              title="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          {/* More Filters Toggle */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateRange(e.target.value, endDate)}
                  className="form-input"
                  title="Start date filter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateRange(startDate, e.target.value)}
                  className="form-input"
                  title="End date filter"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading workshops</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Workshops Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Start Date</span>
                      {getSortIcon('startDate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>End Date</span>
                      {getSortIcon('endDate')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workshops.map((workshop) => (
                  <tr key={workshop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{workshop.title}</div>
                        {workshop.subtitle && (
                          <div className="text-sm text-gray-500 mt-1">{workshop.subtitle}</div>
                        )}
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {workshop.overview}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(workshop.startDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(workshop.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{workshop.targetAudience}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{workshop.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(workshop.status)}`}>
                        {WORKSHOP_STATUS_LABELS[workshop.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(workshop.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-primary hover:text-primary/80" 
                          title="Preview Workshop"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(workshop.id)}
                          className="text-gray-400 hover:text-gray-600" 
                          title="Edit Workshop"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {workshop.status === 'archived' ? (
                          <button 
                            onClick={() => handleRestore(workshop.id)}
                            className="text-green-400 hover:text-green-600" 
                            title="Restore Workshop"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleArchive(workshop.id)}
                            className="text-orange-400 hover:text-orange-600" 
                            title="Archive Workshop"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(workshop.id)}
                          className="text-red-400 hover:text-red-600" 
                          title="Delete Workshop"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{workshop.title}</h3>
                  {workshop.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{workshop.subtitle}</p>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(workshop.status)}`}>
                    {WORKSHOP_STATUS_LABELS[workshop.status]}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.overview}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(workshop.startDate)} - {formatDate(workshop.endDate)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Duration:</span> {workshop.duration}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Audience:</span> {workshop.targetAudience}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-primary hover:text-primary/80" 
                    title="Preview Workshop"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(workshop.id)}
                    className="text-gray-400 hover:text-gray-600" 
                    title="Edit Workshop"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {workshop.status === 'archived' ? (
                    <button 
                      onClick={() => handleRestore(workshop.id)}
                      className="text-green-400 hover:text-green-600" 
                      title="Restore Workshop"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleArchive(workshop.id)}
                      className="text-orange-400 hover:text-orange-600" 
                      title="Archive Workshop"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(workshop.id)}
                    className="text-red-400 hover:text-red-600" 
                    title="Delete Workshop"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(workshop.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !loading && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workshops found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isFiltered 
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first workshop.'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasMore}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasMore}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
