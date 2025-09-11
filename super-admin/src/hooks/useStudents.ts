/**
 * Custom React Hooks for Student Management State Management
 * 
 * Comprehensive hook collection for Student Management using Supabase service functions.
 * Implements React Query for data fetching, caching, and optimistic updates.
 * Includes real-time subscriptions and performance optimizations.
 * 
 * Service Layer: src/services/student.service.ts
 * Database: public.students table with RLS policies
 * 
 * @file useStudents.ts
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import {
  fetchAllStudents,
  fetchStudentById,
  createNewStudent,
  updateExistingStudent,
  deleteStudentRecord,
  searchStudentsWithFilters,
  bulkImportStudents,
  exportStudentsToCSV,
  getStudentStatistics
} from '../services/student.service'
import type {
  Student,
  StudentFormData,
  StudentSearchFilters,
  Enrollment,
  Workshop,
  UserProfile
} from '../types/student.types'
import {
  DATABASE_TABLES,
  STUDENT_STATUS,
  STUDENT_SKILL_LEVELS,
  VALIDATION_RULES,
  PAGINATION_SETTINGS
} from '../constants/student.constants'

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod validation schema for student form data
 */
const studentFormSchema = z.object({
  full_name: z
    .string()
    .min(VALIDATION_RULES.STUDENT_NAME_MIN_LENGTH, 'Name must be at least 2 characters')
    .max(VALIDATION_RULES.STUDENT_NAME_MAX_LENGTH, 'Name cannot exceed 255 characters')
    .trim(),
  date_of_birth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const currentDate = new Date()
      const age = currentDate.getFullYear() - birthDate.getFullYear()
      return age >= VALIDATION_RULES.MIN_STUDENT_AGE && age <= VALIDATION_RULES.MAX_STUDENT_AGE
    }, `Student age must be between ${VALIDATION_RULES.MIN_STUDENT_AGE} and ${VALIDATION_RULES.MAX_STUDENT_AGE} years`),
  school_name: z
    .string()
    .min(VALIDATION_RULES.SCHOOL_NAME_MIN_LENGTH, 'School name must be at least 2 characters')
    .max(VALIDATION_RULES.SCHOOL_NAME_MAX_LENGTH, 'School name cannot exceed 255 characters')
    .trim(),
  grade_level: z
    .string()
    .regex(VALIDATION_RULES.GRADE_LEVEL_REGEX, 'Please select a valid grade level'),
  parent_email: z
    .string()
    .email('Please enter a valid email address')
    .regex(VALIDATION_RULES.EMAIL_REGEX, 'Please enter a valid email address'),
  parent_phone: z
    .string()
    .regex(VALIDATION_RULES.PHONE_REGEX, 'Please enter a valid phone number'),
  emergency_contact_name: z
    .string()
    .optional()
    .or(z.literal('')),
  emergency_contact_phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((phone) => !phone || VALIDATION_RULES.PHONE_REGEX.test(phone), 'Please enter a valid phone number'),
  skill_level: z.enum([
    STUDENT_SKILL_LEVELS.BEGINNER,
    STUDENT_SKILL_LEVELS.INTERMEDIATE,
    STUDENT_SKILL_LEVELS.ADVANCED
  ] as const),
  special_requirements: z
    .string()
    .max(VALIDATION_RULES.SPECIAL_REQUIREMENTS_MAX_LENGTH, 'Special requirements cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  medical_notes: z
    .string()
    .max(VALIDATION_RULES.MEDICAL_NOTES_MAX_LENGTH, 'Medical notes cannot exceed 1000 characters')
    .optional()
    .or(z.literal(''))
})

type StudentFormSchema = z.infer<typeof studentFormSchema>

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * React Query key factory for student-related queries
 */
const studentQueryKeys = {
  all: ['students'] as const,
  lists: () => [...studentQueryKeys.all, 'list'] as const,
  list: (filters: StudentSearchFilters) => [...studentQueryKeys.lists(), filters] as const,
  details: () => [...studentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentQueryKeys.details(), id] as const,
  search: (term: string) => [...studentQueryKeys.all, 'search', term] as const,
  statistics: () => [...studentQueryKeys.all, 'statistics'] as const
}

// ============================================================================
// STUDENTS LIST MANAGEMENT HOOK
// ============================================================================

/**
 * Comprehensive hook for managing students list with filtering, real-time updates, and mutations
 * 
 * @param initialFilters - Initial search and filter parameters
 * @returns Students list state and actions
 * 
 * @example
 * ```typescript
 * const {
 *   students,
 *   loading,
 *   error,
 *   filters,
 *   setFilters,
 *   createStudent,
 *   updateStudent,
 *   deleteStudent,
 *   refetch
 * } = useStudentsList({ status: 'active' })
 * ```
 */
export function useStudentsList(initialFilters: StudentSearchFilters = {}) {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<StudentSearchFilters>({
    page: 1,
    limit: PAGINATION_SETTINGS.DEFAULT_PAGE_SIZE,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...initialFilters
  })

  // Main query for fetching students
  const {
    data: studentsResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: studentQueryKeys.list(filters),
    queryFn: () => fetchAllStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })

  const students = studentsResponse?.data || []
  const totalCount = studentsResponse?.count || 0

  // Real-time subscription for student updates
  useEffect(() => {
    const subscription = supabase
      .channel('students-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DATABASE_TABLES.STUDENTS
        },
        (payload) => {
          console.log('Student table update:', payload)
          // Invalidate and refetch students list
          queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
          queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics() })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  // Create student mutation with optimistic update
  const createStudentMutation = useMutation({
    mutationFn: createNewStudent,
    onMutate: async (newStudent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentQueryKeys.list(filters) })

      // Snapshot current value
      const previousStudents = queryClient.getQueryData(studentQueryKeys.list(filters))

      // Optimistically update with temporary ID
      const optimisticStudent: Student = {
        id: `temp-${Date.now()}`,
        full_name: newStudent.full_name,
        date_of_birth: newStudent.date_of_birth,
        school_name: newStudent.school_name,
        grade_level: newStudent.grade_level,
        parent_email: newStudent.parent_email,
        parent_phone: newStudent.parent_phone,
        emergency_contact_name: newStudent.emergency_contact_name || null,
        emergency_contact_phone: newStudent.emergency_contact_phone || null,
        skill_level: newStudent.skill_level,
        status: STUDENT_STATUS.ACTIVE,
        special_requirements: newStudent.special_requirements || null,
        medical_notes: newStudent.medical_notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
        updated_by: null
      }

      queryClient.setQueryData(studentQueryKeys.list(filters), (old: any) => ({
        ...old,
        data: [optimisticStudent, ...(old?.data || [])],
        count: (old?.count || 0) + 1
      }))

      return { previousStudents }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousStudents) {
        queryClient.setQueryData(studentQueryKeys.list(filters), context.previousStudents)
      }
    },
    onSuccess: () => {
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics() })
    }
  })

  // Update student mutation with optimistic update
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudentFormData> }) =>
      updateExistingStudent(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: studentQueryKeys.list(filters) })
      const previousStudents = queryClient.getQueryData(studentQueryKeys.list(filters))

      // Optimistically update
      queryClient.setQueryData(studentQueryKeys.list(filters), (old: any) => ({
        ...old,
        data: old?.data?.map((student: Student) =>
          student.id === id
            ? { ...student, ...data, updated_at: new Date().toISOString() }
            : student
        ) || []
      }))

      return { previousStudents }
    },
    onError: (_, __, context) => {
      if (context?.previousStudents) {
        queryClient.setQueryData(studentQueryKeys.list(filters), context.previousStudents)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.details() })
    }
  })

  // Delete student mutation with optimistic update
  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudentRecord,
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: studentQueryKeys.list(filters) })
      const previousStudents = queryClient.getQueryData(studentQueryKeys.list(filters))

      // Optimistically remove
      queryClient.setQueryData(studentQueryKeys.list(filters), (old: any) => ({
        ...old,
        data: old?.data?.filter((student: Student) => student.id !== studentId) || [],
        count: Math.max((old?.count || 0) - 1, 0)
      }))

      return { previousStudents }
    },
    onError: (_, __, context) => {
      if (context?.previousStudents) {
        queryClient.setQueryData(studentQueryKeys.list(filters), context.previousStudents)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics() })
    }
  })

  // Memoized filter update function
  const setFiltersOptimized = useCallback(
    (newFilters: StudentSearchFilters) => {
      setFilters(prev => ({ ...prev, ...newFilters, page: 1 })) // Reset to page 1 on filter change
    },
    []
  )

  return {
    students,
    loading: loading || createStudentMutation.isPending || updateStudentMutation.isPending || deleteStudentMutation.isPending,
    error: error?.message || null,
    filters,
    setFilters: setFiltersOptimized,
    totalCount,
    refetch,
    
    // Mutations
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: (id: string, data: Partial<StudentFormData>) =>
      updateStudentMutation.mutateAsync({ id, data }),
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    // Mutation states
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending
  }
}

// ============================================================================
// SINGLE STUDENT MANAGEMENT HOOK
// ============================================================================

/**
 * Hook for managing a single student's details with real-time updates
 * 
 * @param studentId - Student UUID
 * @returns Single student state and actions
 * 
 * @example
 * ```typescript
 * const {
 *   student,
 *   loading,
 *   error,
 *   updateStudent,
 *   deleteStudent,
 *   refetch
 * } = useStudentDetails('student-id')
 * ```
 */
export function useStudentDetails(studentId: string) {
  const queryClient = useQueryClient()

  // Query for single student
  const {
    data: studentResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: studentQueryKeys.detail(studentId),
    queryFn: () => fetchStudentById(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })

  const student = studentResponse?.data || null

  // Real-time subscription for this specific student
  useEffect(() => {
    if (!studentId) return

    const subscription = supabase
      .channel(`student-${studentId}-updates`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DATABASE_TABLES.STUDENTS,
          filter: `id=eq.${studentId}`
        },
        (payload) => {
          console.log('Student detail update:', payload)
          queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(studentId) })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [studentId, queryClient])

  // Update mutation for this student
  const updateStudentMutation = useMutation({
    mutationFn: (data: Partial<StudentFormData>) => updateExistingStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(studentId) })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
    }
  })

  // Delete mutation for this student
  const deleteStudentMutation = useMutation({
    mutationFn: () => deleteStudentRecord(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.removeQueries({ queryKey: studentQueryKeys.detail(studentId) })
    }
  })

  return {
    student,
    loading: loading || updateStudentMutation.isPending || deleteStudentMutation.isPending,
    error: error?.message || null,
    refetch,
    
    // Mutations for this specific student
    updateStudent: updateStudentMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    // Mutation states
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending
  }
}

// ============================================================================
// SEARCH FUNCTIONALITY HOOK
// ============================================================================

/**
 * Debounced search hook for students with search history
 * 
 * @returns Search state and actions
 * 
 * @example
 * ```typescript
 * const {
 *   searchTerm,
 *   setSearchTerm,
 *   searchResults,
 *   loading,
 *   error,
 *   clearSearch
 * } = useStudentSearch()
 * ```
 */
export function useStudentSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Search query (only runs when debounced term changes and meets minimum length)
  const {
    data: searchResponse,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: studentQueryKeys.search(debouncedSearchTerm),
    queryFn: () => searchStudentsWithFilters({
      search: debouncedSearchTerm,
      limit: 20 // Limit search results
    }),
    enabled: debouncedSearchTerm.length >= 2, // Minimum search length
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000 // 5 minutes
  })

  const searchResults = searchResponse?.data || []

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    loading: loading && debouncedSearchTerm.length >= 2,
    error: error?.message || null,
    clearSearch,
    isSearching: debouncedSearchTerm.length >= 2
  }
}

// ============================================================================
// FORM STATE MANAGEMENT HOOK
// ============================================================================

/**
 * Form state management hook with validation using React Hook Form and Zod
 * 
 * @param initialData - Optional initial student data for edit mode
 * @returns Form state and actions
 * 
 * @example
 * ```typescript
 * const {
 *   form,
 *   loading,
 *   error,
 *   submitForm,
 *   resetForm,
 *   isDirty
 * } = useStudentForm(existingStudent)
 * ```
 */
export function useStudentForm(initialData?: Student) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData ? {
      full_name: initialData.full_name,
      date_of_birth: initialData.date_of_birth,
      school_name: initialData.school_name,
      grade_level: initialData.grade_level,
      parent_email: initialData.parent_email,
      parent_phone: initialData.parent_phone,
      emergency_contact_name: initialData.emergency_contact_name || '',
      emergency_contact_phone: initialData.emergency_contact_phone || '',
      skill_level: initialData.skill_level,
      special_requirements: initialData.special_requirements || '',
      medical_notes: initialData.medical_notes || ''
    } : {
      full_name: '',
      date_of_birth: '',
      school_name: '',
      grade_level: '',
      parent_email: '',
      parent_phone: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      skill_level: STUDENT_SKILL_LEVELS.BEGINNER,
      special_requirements: '',
      medical_notes: ''
    }
  })

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      setError(null)
      
      if (initialData) {
        // Update existing student
        return await updateExistingStudent(initialData.id, data)
      } else {
        // Create new student
        return await createNewStudent(data)
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics() })
      
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(initialData.id) })
      }
      
      // Reset form if creating new student
      if (!initialData) {
        form.reset()
      }
    },
    onError: (error: any) => {
      setError(error?.message || 'An error occurred while saving the student')
    }
  })

  const submitForm = useCallback(
    async (data: StudentFormData) => {
      try {
        await mutation.mutateAsync(data)
      } catch (error) {
        // Error is handled in onError
        console.error('Form submission error:', error)
      }
    },
    [mutation]
  )

  const resetForm = useCallback(() => {
    form.reset()
    setError(null)
  }, [form])

  return {
    form: form as UseFormReturn<StudentFormData>,
    loading: mutation.isPending,
    error,
    submitForm,
    resetForm,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    isSubmitting: mutation.isPending
  }
}

// ============================================================================
// BULK OPERATIONS HOOK
// ============================================================================

/**
 * Hook for handling bulk import/export operations with progress tracking
 * 
 * @returns Bulk operations state and actions
 * 
 * @example
 * ```typescript
 * const {
 *   importStudents,
 *   importProgress,
 *   importErrors,
 *   exportStudents,
 *   exportLoading,
 *   clearImportErrors
 * } = useStudentBulkOperations()
 * ```
 */
export function useStudentBulkOperations() {
  const queryClient = useQueryClient()
  const [importProgress, setImportProgress] = useState(0)
  const [importErrors, setImportErrors] = useState<Array<{ row: number; error: string }>>([])

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      setImportProgress(0)
      setImportErrors([])

      // Parse CSV file
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const students: StudentFormData[] = []
      const errors: Array<{ row: number; error: string }> = []

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const studentData: Partial<StudentFormData> = {}

          // Map CSV columns to student fields
          headers.forEach((header, index) => {
            const value = values[index] || ''
            switch (header.toLowerCase()) {
              case 'full_name':
              case 'name':
                studentData.full_name = value
                break
              case 'date_of_birth':
              case 'dob':
                studentData.date_of_birth = value
                break
              case 'school_name':
              case 'school':
                studentData.school_name = value
                break
              case 'grade_level':
              case 'grade':
                studentData.grade_level = value
                break
              case 'parent_email':
              case 'email':
                studentData.parent_email = value
                break
              case 'parent_phone':
              case 'phone':
                studentData.parent_phone = value
                break
              case 'skill_level':
                studentData.skill_level = value as any
                break
              case 'emergency_contact_name':
                studentData.emergency_contact_name = value
                break
              case 'emergency_contact_phone':
                studentData.emergency_contact_phone = value
                break
              case 'special_requirements':
                studentData.special_requirements = value
                break
              case 'medical_notes':
                studentData.medical_notes = value
                break
            }
          })

          // Validate required fields
          if (!studentData.full_name || !studentData.parent_email || !studentData.school_name) {
            errors.push({ row: i + 1, error: 'Missing required fields (name, email, school)' })
            continue
          }

          students.push(studentData as StudentFormData)
        } catch (error) {
          errors.push({ row: i + 1, error: 'Invalid row format' })
        }

        // Update progress
        setImportProgress(Math.round((i / (lines.length - 1)) * 100))
      }

      if (errors.length > 0) {
        setImportErrors(errors)
      }

      if (students.length === 0) {
        throw new Error('No valid students found in file')
      }

      // Import students using bulk service
      const result = await bulkImportStudents(students)
      
      // Add any service errors to our errors array
      const serviceErrors = result.errors.map(err => ({
        row: err.index + 2, // +2 because we skip header and arrays are 0-indexed
        error: err.error
      }))
      
      setImportErrors(prev => [...prev, ...serviceErrors])
      setImportProgress(100)

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics() })
    }
  })

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (filters?: StudentSearchFilters) => {
      const blob = await exportStudentsToCSV(filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  })

  const clearImportErrors = useCallback(() => {
    setImportErrors([])
    setImportProgress(0)
  }, [])

  return {
    // Import
    importStudents: importMutation.mutateAsync,
    importProgress,
    importErrors,
    importLoading: importMutation.isPending,
    
    // Export
    exportStudents: exportMutation.mutateAsync,
    exportLoading: exportMutation.isPending,
    
    // Reset states
    clearImportErrors
  }
}

// ============================================================================
// STATISTICS HOOK
// ============================================================================

/**
 * Hook for fetching student statistics for dashboard and analytics
 * 
 * @returns Student statistics state
 * 
 * @example
 * ```typescript
 * const { statistics, loading, error, refetch } = useStudentStatistics()
 * ```
 */
export function useStudentStatistics() {
  const {
    data: statisticsResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: studentQueryKeys.statistics(),
    queryFn: getStudentStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })

  return {
    statistics: statisticsResponse?.data || null,
    loading,
    error: error?.message || null,
    refetch
  }
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for managing student selection (checkboxes, bulk actions)
 * 
 * @returns Selection state and actions
 */
export function useStudentSelection() {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  const toggleStudent = useCallback((studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((studentIds: string[]) => {
    setSelectedStudents(new Set(studentIds))
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedStudents(new Set())
  }, [])

  const isSelected = useCallback(
    (studentId: string) => selectedStudents.has(studentId),
    [selectedStudents]
  )

  const selectedCount = selectedStudents.size
  const selectedArray = Array.from(selectedStudents)

  return {
    selectedStudents: selectedArray,
    selectedCount,
    toggleStudent,
    selectAll,
    deselectAll,
    isSelected,
    hasSelection: selectedCount > 0
  }
}

// ============================================================================
// ENHANCED STUDENT DETAILS WITH ENROLLMENT HISTORY
// ============================================================================

/**
 * Enhanced student details interface with enrollment history and related data
 */
export interface StudentDetailsData extends Student {
  enrollments: Array<Enrollment & {
    workshop: Workshop & {
      instructor?: UserProfile | null
    }
  }>
  totalEnrollments: number
  attendedCount: number
  attendancePercentage: number
  age: number
  recentActivity: Array<{
    id: string
    type: 'enrollment' | 'attendance' | 'profile_update'
    description: string
    timestamp: string
    workshop?: Workshop
  }>
}

/**
 * Service function to fetch comprehensive student details with enrollment history
 */
async function fetchStudentDetailsWithEnrollments(studentId: string): Promise<{
  data: StudentDetailsData | null
  error: string | null
}> {
  try {
    // Fetch student basic info
    const { data: student, error: studentError } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select('*')
      .eq('id', studentId)
      .single()

    if (studentError) {
      return { data: null, error: studentError.message }
    }

    if (!student) {
      return { data: null, error: 'Student not found' }
    }

    // Fetch enrollments with workshop and instructor details
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        workshop:workshops (
          *,
          instructor:profiles!workshops_instructor_id_fkey (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false })

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
      // Continue without enrollment data rather than failing completely
    }

    // Calculate age
    const birthDate = new Date(student.date_of_birth)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear() - 
      (currentDate.getMonth() < birthDate.getMonth() || 
       (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0)

    // Process enrollment data
    const processedEnrollments = (enrollments || []).map(enrollment => ({
      ...enrollment,
      workshop: {
        ...enrollment.workshop,
        instructor: enrollment.workshop?.instructor || null
      }
    }))

    // Calculate attendance statistics
    const totalEnrollments = processedEnrollments.length
    const attendedCount = processedEnrollments.filter(e => e.attended).length
    const attendancePercentage = totalEnrollments > 0 ? Math.round((attendedCount / totalEnrollments) * 100) : 0

    // Generate recent activity timeline
    const recentActivity: StudentDetailsData['recentActivity'] = []

    // Add enrollment activities
    processedEnrollments.slice(0, 10).forEach(enrollment => {
      recentActivity.push({
        id: `enrollment-${enrollment.id}`,
        type: 'enrollment',
        description: `Enrolled in ${enrollment.workshop?.title || 'workshop'}`,
        timestamp: enrollment.enrolled_at,
        workshop: enrollment.workshop
      })

      if (enrollment.attendance_marked_at) {
        recentActivity.push({
          id: `attendance-${enrollment.id}`,
          type: 'attendance',
          description: `${enrollment.attended ? 'Attended' : 'Missed'} ${enrollment.workshop?.title || 'workshop'}`,
          timestamp: enrollment.attendance_marked_at,
          workshop: enrollment.workshop
        })
      }
    })

    // Add profile update activity
    if (student.updated_at !== student.created_at) {
      recentActivity.push({
        id: `profile-update-${student.id}`,
        type: 'profile_update',
        description: 'Profile information updated',
        timestamp: student.updated_at
      })
    }

    // Sort activities by timestamp (newest first)
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const studentDetails: StudentDetailsData = {
      ...student,
      enrollments: processedEnrollments,
      totalEnrollments,
      attendedCount,
      attendancePercentage,
      age,
      recentActivity: recentActivity.slice(0, 15) // Limit to 15 most recent activities
    }

    return { data: studentDetails, error: null }

  } catch (error) {
    console.error('Error fetching student details:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch student details' 
    }
  }
}

/**
 * Enhanced hook for student details with enrollment history and activity timeline
 * 
 * @param studentId - Student UUID
 * @returns Comprehensive student details with enrollment history
 * 
 * @example
 * ```typescript
 * const {
 *   studentDetails,
 *   loading,
 *   error,
 *   refetch,
 *   updateStudent,
 *   deleteStudent
 * } = useStudentDetailsWithEnrollments('student-id')
 * ```
 */
export function useStudentDetailsWithEnrollments(studentId: string) {
  const queryClient = useQueryClient()

  // Enhanced query for student details with enrollments
  const {
    data: studentDetailsResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: [...studentQueryKeys.detail(studentId), 'enrollments'],
    queryFn: () => fetchStudentDetailsWithEnrollments(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000 // 5 minutes
  })

  const studentDetails = studentDetailsResponse?.data || null

  // Real-time subscription for student and enrollment updates
  useEffect(() => {
    if (!studentId) return

    const subscription = supabase
      .channel(`student-details-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: DATABASE_TABLES.STUDENTS,
          filter: `id=eq.${studentId}`
        },
        () => {
          queryClient.invalidateQueries({ 
            queryKey: [...studentQueryKeys.detail(studentId), 'enrollments'] 
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `student_id=eq.${studentId}`
        },
        () => {
          queryClient.invalidateQueries({ 
            queryKey: [...studentQueryKeys.detail(studentId), 'enrollments'] 
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [studentId, queryClient])

  // Update mutation for this student
  const updateStudentMutation = useMutation({
    mutationFn: (data: Partial<StudentFormData>) => updateExistingStudent(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [...studentQueryKeys.detail(studentId), 'enrollments'] 
      })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
    }
  })

  // Delete mutation for this student
  const deleteStudentMutation = useMutation({
    mutationFn: () => deleteStudentRecord(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() })
      queryClient.removeQueries({ 
        queryKey: [...studentQueryKeys.detail(studentId), 'enrollments'] 
      })
    }
  })

  return {
    studentDetails,
    loading: loading || updateStudentMutation.isPending || deleteStudentMutation.isPending,
    error: studentDetailsResponse?.error || error?.message || null,
    refetch,
    
    // Mutations for this specific student
    updateStudent: updateStudentMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    // Mutation states
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { StudentFormSchema }
export {
  studentQueryKeys,
  studentFormSchema,
  fetchStudentDetailsWithEnrollments
}
