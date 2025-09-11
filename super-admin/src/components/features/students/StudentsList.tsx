/**
 * Comprehensive Student List Component
 * 
 * Feature-rich table component for student management with:
 * - Real-time search and filtering
 * - Sortable columns
 * - Bulk selection and operations
 * - Mobile responsive design
 * - Role-based permissions
 * - CRUD operations with optimistic updates
 * 
 * Uses shadcn/ui components and integrates with useStudentsList hook
 * 
 * @file StudentsList.tsx
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react'
import { useStudentsList, useStudentSearch, useStudentSelection } from '../../../hooks/useStudents'
import { formatDate, debounce, cn } from '../../../utils'
import type { Student, StudentSearchFilters, UserRole } from '../../../types/student.types'
import {
  STUDENT_STATUS,
  STUDENT_STATUS_LABELS,
  STUDENT_SKILL_LEVELS,
  STUDENT_SKILL_LEVEL_LABELS,
  STUDENT_GRADES,
  STUDENT_GRADE_LABELS,
  PAGINATION_SETTINGS,
  USER_ROLES
} from '../../../constants/student.constants'

// UI Components
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Select } from '../../ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Checkbox } from '../../ui/Checkbox'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/Table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/Dialog'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface StudentsListProps {
  initialFilters?: StudentSearchFilters
  onStudentSelect?: (student: Student) => void
  onEditStudent?: (student: Student) => void
  onDeleteStudent?: (student: Student) => void
  showBulkActions?: boolean
  maxHeight?: string
  role: UserRole
}

interface TableColumn {
  key: keyof Student | 'actions'
  label: string
  sortable: boolean
  mobileHidden?: boolean
}

// ============================================================================
// TABLE CONFIGURATION
// ============================================================================

const columns: TableColumn[] = [
  { key: 'full_name', label: 'Name', sortable: true },
  { key: 'school_name', label: 'School', sortable: true, mobileHidden: true },
  { key: 'grade_level', label: 'Grade', sortable: false },
  { key: 'skill_level', label: 'Skill Level', sortable: true, mobileHidden: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Enrolled', sortable: true, mobileHidden: true },
  { key: 'actions', label: 'Actions', sortable: false }
]

// ============================================================================
// FILTER OPTIONS CONFIGURATION
// ============================================================================

const filterOptions = {
  status: Object.values(STUDENT_STATUS),
  skillLevel: Object.values(STUDENT_SKILL_LEVELS),
  gradeLevel: Object.values(STUDENT_GRADES)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets permission level for current user role
 */
const getPermissionLevel = (role: UserRole): {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canBulkDelete: boolean
  canExport: boolean
} => {
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canBulkDelete: true,
        canExport: true
      }
    case USER_ROLES.ADMIN:
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canBulkDelete: false,
        canExport: true
      }
    case USER_ROLES.TEACHER:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canBulkDelete: false,
        canExport: true
      }
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canBulkDelete: false,
        canExport: false
      }
  }
}

/**
 * Gets badge variant based on student status
 */
const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' => {
  switch (status) {
    case STUDENT_STATUS.ACTIVE:
      return 'success'
    case STUDENT_STATUS.SUSPENDED:
      return 'destructive'
    case STUDENT_STATUS.GRADUATED:
      return 'default'
    case STUDENT_STATUS.INACTIVE:
    default:
      return 'secondary'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StudentsList = ({
  initialFilters = {},
  onStudentSelect,
  onEditStudent,
  onDeleteStudent,
  showBulkActions = true,
  maxHeight,
  role
}: StudentsListProps) => {
  // Hooks
  const {
    students,
    loading,
    error,
    filters,
    setFilters,
    totalCount,
    refetch,
    deleteStudent,
    isDeleting
  } = useStudentsList(initialFilters)

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    clearSearch,
    isSearching
  } = useStudentSearch()

  const {
    selectedStudents,
    selectedCount,
    toggleStudent,
    selectAll,
    deselectAll,
    isSelected,
    hasSelection
  } = useStudentSelection()

  // Local state
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Get permissions
  const permissions = getPermissionLevel(role)
  
  // Ensure students is always an array
  const studentsArray = Array.isArray(students) ? students : []

  // ============================================================================
  // SEARCH AND FILTER HANDLERS
  // ============================================================================

  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      const term = args[0] as string
      if (term.length >= 2) {
        setFilters({ search: term, page: 1 })
      } else if (term.length === 0) {
        setFilters({ search: undefined, page: 1 })
      }
    }, 300),
    [setFilters]
  )

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  const handleFilterChange = useCallback(
    (key: keyof StudentSearchFilters, value: string | undefined) => {
      setFilters({
        [key]: value === 'all' || value === '' ? undefined : value,
        page: 1
      })
    },
    [setFilters]
  )

  const handleSort = useCallback(
    (column: keyof Student) => {
      const isCurrentSort = filters.sort_by === column
      const newOrder = isCurrentSort && filters.sort_order === 'asc' ? 'desc' : 'asc'
      
      // Only allow certain columns for sorting
      const validSortColumns = ['full_name', 'created_at', 'updated_at', 'date_of_birth'] as const
      if (validSortColumns.includes(column as any)) {
        setFilters({
          sort_by: column as any,
          sort_order: newOrder
        })
      }
    },
    [filters.sort_by, filters.sort_order, setFilters]
  )

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: undefined,
      status: undefined,
      skill_level: undefined,
      grade_level: undefined,
      school_name: undefined,
      page: 1
    })
    setSearchTerm('')
    clearSearch()
  }, [setFilters, setSearchTerm, clearSearch])

  // ============================================================================
  // CRUD HANDLERS
  // ============================================================================


  const handleDeleteConfirm = useCallback(async () => {
    if (!studentToDelete) return

    try {
      await deleteStudent(studentToDelete.id)
      setDeleteDialogOpen(false)
      setStudentToDelete(null)
      // Success feedback would be handled by the hook's mutation
    } catch (error) {
      console.error('Delete error:', error)
      // Error feedback would be handled by the hook's mutation
    }
  }, [deleteStudent, studentToDelete])

  const handleBulkDeleteClick = useCallback(() => {
    setBulkDeleteDialogOpen(true)
  }, [])

  const handleBulkDeleteConfirm = useCallback(async () => {
    if (!hasSelection) return

    try {
      // Delete all selected students
      await Promise.all(selectedStudents.map(id => deleteStudent(id)))
      setBulkDeleteDialogOpen(false)
      deselectAll()
    } catch (error) {
      console.error('Bulk delete error:', error)
    }
  }, [selectedStudents, deleteStudent, hasSelection, deselectAll])

  const handleRowClick = useCallback(
    (student: Student) => {
      if (onStudentSelect) {
        onStudentSelect(student)
      }
    },
    [onStudentSelect]
  )

  // ============================================================================
  // PAGINATION HANDLERS
  // ============================================================================

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
  )


  // ============================================================================
  // BULK SELECTION HANDLERS
  // ============================================================================

  const handleSelectAll = useCallback(() => {
    if (hasSelection) {
      deselectAll()
    } else {
      selectAll(studentsArray.map((student: Student) => student.id))
    }
  }, [hasSelection, deselectAll, selectAll, studentsArray])

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const searchResultsArray = Array.isArray(searchResults) ? searchResults : []
  const displayStudents = isSearching && searchResultsArray.length > 0 ? searchResultsArray : studentsArray
  const totalPages = Math.ceil(totalCount / (filters.limit || PAGINATION_SETTINGS.DEFAULT_PAGE_SIZE))
  const currentPage = filters.page || 1

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderStatusBadge = (status: string) => (
    <Badge variant={getStatusBadgeVariant(status)}>
      {STUDENT_STATUS_LABELS[status as keyof typeof STUDENT_STATUS_LABELS] || status}
    </Badge>
  )

  const renderSkillLevel = (skillLevel: string) => (
    <span className="text-sm">
      {STUDENT_SKILL_LEVEL_LABELS[skillLevel as keyof typeof STUDENT_SKILL_LEVEL_LABELS] || skillLevel}
    </span>
  )

  const renderGradeLevel = (gradeLevel: string) => (
    <span className="text-sm font-medium">
      {STUDENT_GRADE_LABELS[gradeLevel as keyof typeof STUDENT_GRADE_LABELS] || gradeLevel}
    </span>
  )

  const renderSortButton = (column: TableColumn) => {
    if (!column.sortable) return column.label

    const isSorted = filters.sort_by === column.key
    const sortDirection = isSorted ? filters.sort_order : null

    return (
      <button
        onClick={() => handleSort(column.key as keyof Student)}
        className="flex items-center gap-1 hover:text-foreground"
      >
        {column.label}
        {isSorted && (
          <span className="ml-1 text-xs">
            {sortDirection === 'asc' ? '^' : 'v'}
          </span>
        )}
      </button>
    )
  }

  // ============================================================================
  // MOBILE FILTER PANEL
  // ============================================================================

  const MobileFilterPanel = () => (
    <div className={cn(
      'lg:hidden',
      showMobileFilters ? 'block' : 'hidden'
    )}>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              {filterOptions.status.map(status => (
                <option key={status} value={status}>
                  {STUDENT_STATUS_LABELS[status as keyof typeof STUDENT_STATUS_LABELS]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Skill Level</label>
            <Select
              value={filters.skill_level || 'all'}
              onChange={(e) => handleFilterChange('skill_level', e.target.value)}
            >
              <option value="all">All Skill Levels</option>
              {filterOptions.skillLevel.map(level => (
                <option key={level} value={level}>
                  {STUDENT_SKILL_LEVEL_LABELS[level as keyof typeof STUDENT_SKILL_LEVEL_LABELS]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Grade Level</label>
            <Select
              value={filters.grade_level || 'all'}
              onChange={(e) => handleFilterChange('grade_level', e.target.value)}
            >
              <option value="all">All Grades</option>
              {filterOptions.gradeLevel.map(grade => (
                <option key={grade} value={grade}>
                  {STUDENT_GRADE_LABELS[grade as keyof typeof STUDENT_GRADE_LABELS]}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // ============================================================================
  // EMPTY STATE
  // ============================================================================

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {isSearching ? 'No students found' : 'No students yet'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {isSearching
          ? 'Try adjusting your search or filters'
          : 'Get started by adding your first student'}
      </p>
      {permissions.canCreate && !isSearching && (
        <Button onClick={() => console.log('Create student clicked')}>
          Add Student
        </Button>
      )}
    </div>
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Students</CardTitle>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {permissions.canCreate && (
                <Button onClick={() => console.log('Create student clicked')}>
                  Add Student
                </Button>
              )}
              {permissions.canExport && (
                <Button variant="outline" onClick={() => console.log('Export clicked')}>
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name, school, or parent email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden"
            >
              Filters {showMobileFilters ? '-' : '+'}
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            <Select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              {filterOptions.status.map(status => (
                <option key={status} value={status}>
                  {STUDENT_STATUS_LABELS[status as keyof typeof STUDENT_STATUS_LABELS]}
                </option>
              ))}
            </Select>

            <Select
              value={filters.skill_level || 'all'}
              onChange={(e) => handleFilterChange('skill_level', e.target.value)}
            >
              <option value="all">All Skill Levels</option>
              {filterOptions.skillLevel.map(level => (
                <option key={level} value={level}>
                  {STUDENT_SKILL_LEVEL_LABELS[level as keyof typeof STUDENT_SKILL_LEVEL_LABELS]}
                </option>
              ))}
            </Select>

            <Select
              value={filters.grade_level || 'all'}
              onChange={(e) => handleFilterChange('grade_level', e.target.value)}
            >
              <option value="all">All Grades</option>
              {filterOptions.gradeLevel.map(grade => (
                <option key={grade} value={grade}>
                  {STUDENT_GRADE_LABELS[grade as keyof typeof STUDENT_GRADE_LABELS]}
                </option>
              ))}
            </Select>

            <Button variant="outline" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden gap-2">
            {permissions.canCreate && (
              <Button 
                onClick={() => console.log('Create student clicked')}
                className="flex-1"
              >
                Add Student
              </Button>
            )}
            {permissions.canExport && (
              <Button 
                variant="outline" 
                onClick={() => console.log('Export clicked')}
                className="flex-1"
              >
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Filter Panel */}
      <MobileFilterPanel />

      {/* Bulk Actions */}
      {showBulkActions && hasSelection && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={deselectAll}>
                  Clear Selection
                </Button>
                {permissions.canExport && (
                  <Button variant="outline" onClick={() => console.log('Export selected')}>
                    Export Selected
                  </Button>
                )}
                {permissions.canBulkDelete && (
                  <Button variant="destructive" onClick={handleBulkDeleteClick}>
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {loading && !studentsArray.length ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-2">Error loading students</div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : displayStudents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className={cn(
              'overflow-auto',
              maxHeight && `max-h-[${maxHeight}]`
            )}>
              <Table>
                <TableHeader>
                  <TableRow>
                    {showBulkActions && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={hasSelection && selectedCount === displayStudents.length}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                    )}
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={cn(
                          column.mobileHidden && 'hidden lg:table-cell'
                        )}
                      >
                        {renderSortButton(column)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayStudents.map((student: Student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(student)}
                    >
                      {showBulkActions && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected(student.id)}
                            onChange={() => toggleStudent(student.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        {student.full_name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {student.school_name}
                      </TableCell>
                      <TableCell>
                        {renderGradeLevel(student.grade_level)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {renderSkillLevel(student.skill_level)}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(student.status)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(student.created_at)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {permissions.canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditStudent?.(student)}
                            >
                              Edit
                            </Button>
                          )}
                          {permissions.canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteStudent?.(student)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * (filters.limit || PAGINATION_SETTINGS.DEFAULT_PAGE_SIZE)) + 1} to{' '}
                {Math.min(currentPage * (filters.limit || PAGINATION_SETTINGS.DEFAULT_PAGE_SIZE), totalCount)} of{' '}
                {totalCount} students
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {studentToDelete?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Students</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} student{selectedCount !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentsList
