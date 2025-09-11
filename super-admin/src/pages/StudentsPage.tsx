/**
 * Students Page - Main Orchestration Component
 * 
 * A comprehensive student management page that orchestrates all student components
 * with proper routing, state management, and role-based UI rendering.
 * 
 * Features:
 * - React Router integration with URL parameter handling
 * - Modal state management for all CRUD operations
 * - Role-based UI rendering and permission checks
 * - URL filter persistence and deep linking
 * - Breadcrumb navigation support
 * 
 * @file StudentsPage.tsx
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Upload, Users } from 'lucide-react'

// Hooks and Context
import { useAuth } from '../contexts/AuthContext'
import { useStudentsList } from '../hooks/useStudents'

// Types
import type { Student, StudentFormData, UserRole, StudentSearchFilters } from '../types/student.types'

// Constants
import { USER_ROLES } from '../constants/userRoles'
import { STUDENT_SUCCESS_MESSAGES, STUDENT_ERROR_MESSAGES } from '../constants/student.constants'

// Components
import StudentsList from '../components/features/students/StudentsList'
import StudentForm from '../components/features/students/StudentForm'
import StudentDetails from '../components/features/students/StudentDetails'
import { StudentBulkOperations } from '../components/features/students/StudentBulkOperations'

// UI Components
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================


interface ModalState {
  addStudent: boolean
  editStudent: boolean
  viewStudent: boolean
  deleteConfirm: boolean
  bulkImport: boolean
}

interface PageState {
  selectedStudent: Student | null
  isLoading: boolean
  error: string | null
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
  canBulkImport: boolean
  canExport: boolean
} => {
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canBulkImport: true,
        canExport: true
      }
    case USER_ROLES.ADMIN:
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canBulkImport: false,
        canExport: true
      }
    case USER_ROLES.TEACHER:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canBulkImport: false,
        canExport: true
      }
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canBulkImport: false,
        canExport: false
      }
  }
}

/**
 * Converts URL search params to filter object
 */
const parseFiltersFromParams = (searchParams: URLSearchParams): StudentSearchFilters => {
  const filters: StudentSearchFilters = {}
  
  const search = searchParams.get('search')
  if (search) filters.search = search
  
  const status = searchParams.get('status')
  if (status) filters.status = status as any
  
  const skillLevel = searchParams.get('skill_level')
  if (skillLevel) filters.skill_level = skillLevel as any
  
  const gradeLevel = searchParams.get('grade_level')
  if (gradeLevel) filters.grade_level = gradeLevel as any
  
  const schoolName = searchParams.get('school_name')
  if (schoolName) filters.school_name = schoolName
  
  const page = searchParams.get('page')
  if (page) filters.page = parseInt(page, 10)
  
  const limit = searchParams.get('limit')
  if (limit) filters.limit = parseInt(limit, 10)
  
  const sortBy = searchParams.get('sort_by')
  if (sortBy) filters.sort_by = sortBy as any
  
  const sortOrder = searchParams.get('sort_order')
  if (sortOrder) filters.sort_order = sortOrder as any
  
  return filters
}

/**
 * Converts filter object to URL search params
 */
const serializeFiltersToParams = (filters: StudentSearchFilters): URLSearchParams => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  
  return params
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Page Header Component
 */
interface StudentPageHeaderProps {
  userRole: UserRole
  onAddStudent: () => void
  onBulkImport: () => void
  totalCount?: number
  loading?: boolean
}

const StudentPageHeader = ({ 
  userRole, 
  onAddStudent, 
  onBulkImport, 
  totalCount, 
  loading 
}: StudentPageHeaderProps) => {
  const permissions = getPermissionLevel(userRole)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Student Management</CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage student profiles and enrollments
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {loading ? (
                  <>
                    <LoadingSpinner className="w-3 h-3" />
                    Loading...
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Connected
                  </>
                )}
              </Badge>
              {totalCount !== undefined && (
                <span className="text-sm text-muted-foreground">
                  {totalCount} students
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {permissions.canBulkImport && (
                <Button variant="outline" onClick={onBulkImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              )}
              {permissions.canCreate && (
                <Button onClick={onAddStudent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

/**
 * Modal Management Component
 */
interface StudentModalsProps {
  modals: ModalState
  setModals: React.Dispatch<React.SetStateAction<ModalState>>
  selectedStudent: Student | null
  setSelectedStudent: (student: Student | null) => void
  userRole: UserRole
  onSuccess: () => void
}

const StudentModals = ({ 
  modals, 
  setModals, 
  selectedStudent, 
  setSelectedStudent, 
  userRole,
  onSuccess 
}: StudentModalsProps) => {
  const { 
    createStudent, 
    updateStudent, 
    deleteStudent,
    loading: operationLoading 
  } = useStudentsList()
  
  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
    if (modalName !== 'bulkImport') {
      setSelectedStudent(null)
    }
  }, [setModals, setSelectedStudent])
  
  const handleFormSubmit = useCallback(async (data: StudentFormData) => {
    try {
      if (modals.addStudent) {
        await createStudent(data)
        console.log(STUDENT_SUCCESS_MESSAGES.CREATE_SUCCESS)
        closeModal('addStudent')
      } else if (modals.editStudent && selectedStudent) {
        await updateStudent(selectedStudent.id, data)
        console.log(STUDENT_SUCCESS_MESSAGES.UPDATE_SUCCESS)
        closeModal('editStudent')
      }
      onSuccess()
    } catch (error: any) {
      console.error('Form submission error:', error)
      throw new Error(error?.message || STUDENT_ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }, [modals, selectedStudent, createStudent, updateStudent, closeModal, onSuccess])
  
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedStudent) return
    
    try {
      await deleteStudent(selectedStudent.id)
      console.log(STUDENT_SUCCESS_MESSAGES.DELETE_SUCCESS)
      closeModal('deleteConfirm')
      onSuccess()
    } catch (error: any) {
      console.error('Delete error:', error)
      throw new Error(error?.message || STUDENT_ERROR_MESSAGES.DELETE_ERROR)
    }
  }, [selectedStudent, deleteStudent, closeModal, onSuccess])
  
  return (
    <>
      {/* Add Student Modal */}
      <Dialog open={modals.addStudent} onOpenChange={() => closeModal('addStudent')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Create a new student profile with their personal and academic information.
            </DialogDescription>
          </DialogHeader>
          <StudentForm 
            mode="create"
            onSubmit={handleFormSubmit}
            onCancel={() => closeModal('addStudent')}
            loading={operationLoading}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Modal */}
      <Dialog open={modals.editStudent} onOpenChange={() => closeModal('editStudent')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update {selectedStudent?.full_name}'s information and academic details.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <StudentForm 
              mode="edit"
              initialData={selectedStudent}
              onSubmit={handleFormSubmit}
              onCancel={() => closeModal('editStudent')}
              loading={operationLoading}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Student Modal */}
      <Dialog open={modals.viewStudent} onOpenChange={() => closeModal('viewStudent')}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedStudent?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <StudentDetails 
              studentId={selectedStudent.id}
              editable={false}
              showEnrollments={true}
              userRole={userRole}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={modals.deleteConfirm} onOpenChange={() => closeModal('deleteConfirm')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.full_name}? 
              This action cannot be undone and will remove all associated enrollment records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal('deleteConfirm')}
              disabled={operationLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={operationLoading}
            >
              {operationLoading ? 'Deleting...' : 'Delete Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Modal */}
      <Dialog open={modals.bulkImport} onOpenChange={() => closeModal('bulkImport')}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Students</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple students at once.
            </DialogDescription>
          </DialogHeader>
          <StudentBulkOperations 
            onImportComplete={(results: any) => {
              console.log('Import completed:', results)
              closeModal('bulkImport')
              onSuccess()
            }}
            onExportComplete={(file: any) => {
              console.log('Export completed:', file)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StudentsPage = () => {
  // Hooks
  const { profile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [modals, setModals] = useState<ModalState>({
    addStudent: false,
    editStudent: false,
    viewStudent: false,
    deleteConfirm: false,
    bulkImport: false
  })
  
  const [pageState, setPageState] = useState<PageState>({
    selectedStudent: null,
    isLoading: false,
    error: null
  })
  
  // Get user role from profile  
  const userRole = (profile?.role || 'teacher') as UserRole
  const permissions = getPermissionLevel(userRole)
  
  // Parse initial filters from URL
  const initialFilters = parseFiltersFromParams(searchParams)
  
  // Students data hook
  const {  
    students,
    loading,
    error,
    totalCount,
    refetch,
    filters
  } = useStudentsList(initialFilters)
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Update URL when filters change
  useEffect(() => {
    const newParams = serializeFiltersToParams(filters)
    setSearchParams(newParams, { replace: true })
  }, [filters, setSearchParams])
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const openModal = useCallback((modalType: keyof ModalState, student?: Student) => {
    setModals(prev => ({ ...prev, [modalType]: true }))
    if (student) {
      setPageState(prev => ({ ...prev, selectedStudent: student }))
    }
  }, [])
  
  const handleStudentSelect = useCallback((student: Student) => {
    openModal('viewStudent', student)
  }, [openModal])
  
  const handleEditStudent = useCallback((student: Student) => {
    openModal('editStudent', student)
  }, [openModal])
  
  const handleDeleteStudent = useCallback((student: Student) => {
    openModal('deleteConfirm', student)
  }, [openModal])
  
  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])
  
  // ============================================================================
  // ERROR HANDLING
  // ============================================================================
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <div className="text-destructive font-medium mb-2">
              Unable to load students
            </div>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={handleRefresh}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <StudentPageHeader 
        userRole={userRole}
        onAddStudent={() => openModal('addStudent')}
        onBulkImport={() => openModal('bulkImport')}
        totalCount={totalCount}
        loading={loading}
      />
      
      {/* Main Content */}
      <StudentsList 
        onStudentSelect={handleStudentSelect}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        showBulkActions={true}
        role={userRole}
      />
      
      {/* Modals */}
      <StudentModals 
        modals={modals}
        setModals={setModals}
        selectedStudent={pageState.selectedStudent}
        setSelectedStudent={(student) => 
          setPageState(prev => ({ ...prev, selectedStudent: student }))
        }
        userRole={userRole}
        onSuccess={handleRefresh}
      />
      
      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Development Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div><strong>User Role:</strong> {userRole}</div>
            <div><strong>Permissions:</strong> {JSON.stringify(permissions)}</div>
            <div><strong>Students Loaded:</strong> {Array.isArray(students) ? students.length : 0}</div>
            <div><strong>Total Count:</strong> {totalCount}</div>
            <div><strong>Current Filters:</strong> {JSON.stringify(filters)}</div>
            <div><strong>URL Params:</strong> {searchParams.toString()}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentsPage
