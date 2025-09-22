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
import { Plus, Users, X, Mail, Pencil } from 'lucide-react'

// Hooks and Context
import { useAuth } from '../contexts/AuthContext'
import { useStudentsList } from '../hooks/useStudents'

// Types
import type { Student, StudentFormData, UserRole, StudentSearchFilters, StudentStatus, SkillLevel, GradeLevel } from '../types/student.types'

// Constants
import { USER_ROLES } from '../constants/userRoles'
import { STUDENT_SUCCESS_MESSAGES, STUDENT_ERROR_MESSAGES } from '../constants/student.constants'

// Components
import StudentsList from '../components/features/students/StudentsList'
import StudentForm from '../components/features/students/StudentForm'
import StudentDetails from '../components/features/students/StudentDetails'

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
  if (status) filters.status = status as StudentStatus
  
  const skillLevel = searchParams.get('skill_level')
  if (skillLevel) filters.skill_level = skillLevel as SkillLevel
  
  const gradeLevel = searchParams.get('grade_level')
  if (gradeLevel) filters.grade_level = gradeLevel as GradeLevel
  
  const schoolName = searchParams.get('school_name')
  if (schoolName) filters.school_name = schoolName
  
  const page = searchParams.get('page')
  if (page) filters.page = parseInt(page, 10)
  
  const limit = searchParams.get('limit')
  if (limit) filters.limit = parseInt(limit, 10)
  
  const sortBy = searchParams.get('sort_by')
  if (sortBy) filters.sort_by = sortBy as StudentSearchFilters['sort_by']
  
  const sortOrder = searchParams.get('sort_order')
  if (sortOrder) filters.sort_order = sortOrder as StudentSearchFilters['sort_order']
  
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
  totalCount?: number
  loading?: boolean
}

const StudentPageHeader = ({ 
  userRole, 
  onAddStudent,
  totalCount, 
  loading 
}: StudentPageHeaderProps) => {
  const permissions = getPermissionLevel(userRole)
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl lg:text-2xl">Student Management</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                Manage student profiles and enrollments
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
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
            <div className="flex gap-2 w-full sm:w-auto">
              {permissions.canCreate && (
                <Button onClick={onAddStudent} className="flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Student</span>
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
    setSelectedStudent(null)
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
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-0">
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
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-0">
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
      
      {/* View Student Modal - Desktop-optimized */}
      <Dialog open={modals.viewStudent} onOpenChange={() => closeModal('viewStudent')}>
        <DialogContent className="w-[92vw] max-w-[1280px] max-h-[90vh] overflow-hidden p-0">
          {/* Sticky Header with actions and close */}
          <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-muted-foreground shrink-0">Student</span>
              <span className="text-base font-semibold truncate">{selectedStudent?.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Quick actions */}
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!selectedStudent) return
                  closeModal('viewStudent')
                  setSelectedStudent(selectedStudent)
                  setModals(prev => ({ ...prev, editStudent: true }))
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {selectedStudent?.parent_email && (
                <a href={`mailto:${selectedStudent.parent_email}`}>
                  <Button variant="secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Parent
                  </Button>
                </a>
              )}
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => closeModal('viewStudent')}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-56px)]">
            {selectedStudent && (
              <StudentDetails 
                studentId={selectedStudent.id}
                editable={false}
                showEnrollments={true}
                userRole={userRole}
              />
            )}
          </div>
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
    deleteConfirm: false
  })
  
  const [pageState, setPageState] = useState<PageState>({
    selectedStudent: null,
    isLoading: false,
    error: null
  })
  
  // Get user role from profile  
  const userRole = (profile?.role || 'teacher') as UserRole
  
  // Parse initial filters from URL
  const initialFilters = parseFiltersFromParams(searchParams)
  
  // Students data hook
  const {  
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Card className="border-destructive shadow-sm">
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
      </div>
    )
  }
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Page Header */}
          <StudentPageHeader 
            userRole={userRole}
            onAddStudent={() => openModal('addStudent')}
            totalCount={totalCount}
            loading={loading}
          />
          
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <StudentsList 
              onStudentSelect={handleStudentSelect}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              showBulkActions={true}
              role={userRole}
            />
          </div>
        </div>
      </div>
      
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
    </div>
  )
}

export default StudentsPage
