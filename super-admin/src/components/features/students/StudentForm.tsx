/**
 * Comprehensive Student Form Component
 * 
 * Feature-rich form component for creating and editing students with:
 * - React Hook Form integration with Zod validation
 * - Database schema exact matching
 * - Real-time validation and error handling
 * - Auto-save functionality
 * - Mobile responsive design
 * - Accessibility features
 * 
 * Matches database constraints exactly and uses constants throughout
 * 
 * @file StudentForm.tsx
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '../../../utils'
import type { Student, StudentFormData } from '../../../types/student.types'
import {
  STUDENT_FORM_FIELDS,
  STUDENT_GRADES,
  STUDENT_GRADE_LABELS,
  STUDENT_SKILL_LEVELS,
  STUDENT_SKILL_LEVEL_LABELS,
  STUDENT_SKILL_LEVEL_DESCRIPTIONS,
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  STUDENT_ERROR_MESSAGES
} from '../../../constants/student.constants'

// UI Components
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Select } from '../../ui/Select'
import { Textarea } from '../../ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../../ui/Form'

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

/**
 * Calculate age from date of birth
 */
const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Zod validation schema matching database constraints exactly
 */
const studentFormSchema = z.object({
  [STUDENT_FORM_FIELDS.FULL_NAME]: z
    .string()
    .min(VALIDATION_RULES.STUDENT_NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_TOO_SHORT)
    .max(VALIDATION_RULES.STUDENT_NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_TOO_LONG)
    .trim(),
    
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED_FIELD)
    .refine((date) => {
      if (!date) return false
      const birthDate = new Date(date)
      if (isNaN(birthDate.getTime())) return false
      
      const age = calculateAge(birthDate)
      return age >= VALIDATION_RULES.MIN_STUDENT_AGE && age <= VALIDATION_RULES.MAX_STUDENT_AGE
    }, VALIDATION_MESSAGES.INVALID_AGE),
    
  [STUDENT_FORM_FIELDS.SCHOOL_NAME]: z
    .string()
    .min(VALIDATION_RULES.SCHOOL_NAME_MIN_LENGTH, 'School name must be at least 2 characters')
    .max(VALIDATION_RULES.SCHOOL_NAME_MAX_LENGTH, 'School name cannot exceed 255 characters')
    .trim(),
    
  [STUDENT_FORM_FIELDS.GRADE_LEVEL]: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED_FIELD)
    .regex(VALIDATION_RULES.GRADE_LEVEL_REGEX, VALIDATION_MESSAGES.INVALID_GRADE),
    
  [STUDENT_FORM_FIELDS.PARENT_EMAIL]: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED_FIELD)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .regex(VALIDATION_RULES.EMAIL_REGEX, VALIDATION_MESSAGES.INVALID_EMAIL)
    .max(255, 'Email address too long'),
    
  [STUDENT_FORM_FIELDS.PARENT_PHONE]: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED_FIELD)
    .regex(VALIDATION_RULES.PHONE_REGEX, VALIDATION_MESSAGES.INVALID_PHONE)
    .max(20, 'Phone number too long'),
    
  // Optional fields
  [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME]: z
    .string()
    .max(VALIDATION_RULES.STUDENT_NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_TOO_LONG)
    .optional()
    .or(z.literal('')),
    
  [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE]: z
    .string()
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal(''))
    .refine((phone) => !phone || VALIDATION_RULES.PHONE_REGEX.test(phone), VALIDATION_MESSAGES.INVALID_PHONE),
    
  [STUDENT_FORM_FIELDS.SKILL_LEVEL]: z
    .enum([STUDENT_SKILL_LEVELS.BEGINNER, STUDENT_SKILL_LEVELS.INTERMEDIATE, STUDENT_SKILL_LEVELS.ADVANCED] as const)
    .refine((value) => !!value, { message: VALIDATION_MESSAGES.REQUIRED_FIELD }),
    
  [STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS]: z
    .string()
    .max(VALIDATION_RULES.SPECIAL_REQUIREMENTS_MAX_LENGTH, VALIDATION_MESSAGES.TEXT_TOO_LONG)
    .optional()
    .or(z.literal('')),
    
  [STUDENT_FORM_FIELDS.MEDICAL_NOTES]: z
    .string()
    .max(VALIDATION_RULES.MEDICAL_NOTES_MAX_LENGTH, VALIDATION_MESSAGES.TEXT_TOO_LONG)
    .optional()
    .or(z.literal(''))
})

type StudentFormSchema = z.infer<typeof studentFormSchema>

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface StudentFormProps {
  initialData?: Student
  onSubmit: (data: StudentFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert Student to form data
 */
const studentToFormData = (student: Student): StudentFormSchema => ({
  [STUDENT_FORM_FIELDS.FULL_NAME]: student.full_name,
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: student.date_of_birth,
  [STUDENT_FORM_FIELDS.SCHOOL_NAME]: student.school_name,
  [STUDENT_FORM_FIELDS.GRADE_LEVEL]: student.grade_level,
  [STUDENT_FORM_FIELDS.PARENT_EMAIL]: student.parent_email,
  [STUDENT_FORM_FIELDS.PARENT_PHONE]: student.parent_phone,
  [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME]: student.emergency_contact_name || '',
  [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE]: student.emergency_contact_phone || '',
  [STUDENT_FORM_FIELDS.SKILL_LEVEL]: student.skill_level,
  [STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS]: student.special_requirements || '',
  [STUDENT_FORM_FIELDS.MEDICAL_NOTES]: student.medical_notes || ''
})

/**
 * Convert form data to StudentFormData
 */
const formDataToStudentData = (formData: StudentFormSchema): StudentFormData => ({
  full_name: formData[STUDENT_FORM_FIELDS.FULL_NAME],
  date_of_birth: formData[STUDENT_FORM_FIELDS.DATE_OF_BIRTH],
  school_name: formData[STUDENT_FORM_FIELDS.SCHOOL_NAME],
  grade_level: formData[STUDENT_FORM_FIELDS.GRADE_LEVEL],
  parent_email: formData[STUDENT_FORM_FIELDS.PARENT_EMAIL],
  parent_phone: formData[STUDENT_FORM_FIELDS.PARENT_PHONE],
  emergency_contact_name: formData[STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME] || undefined,
  emergency_contact_phone: formData[STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE] || undefined,
  skill_level: formData[STUDENT_FORM_FIELDS.SKILL_LEVEL] as any,
  special_requirements: formData[STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS] || undefined,
  medical_notes: formData[STUDENT_FORM_FIELDS.MEDICAL_NOTES] || undefined
})

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StudentForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode
}: StudentFormProps) => {
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData ? studentToFormData(initialData) : {
      [STUDENT_FORM_FIELDS.FULL_NAME]: '',
      [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: '',
      [STUDENT_FORM_FIELDS.SCHOOL_NAME]: '',
      [STUDENT_FORM_FIELDS.GRADE_LEVEL]: '',
      [STUDENT_FORM_FIELDS.PARENT_EMAIL]: '',
      [STUDENT_FORM_FIELDS.PARENT_PHONE]: '',
      [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME]: '',
      [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE]: '',
      [STUDENT_FORM_FIELDS.SKILL_LEVEL]: STUDENT_SKILL_LEVELS.BEGINNER,
      [STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS]: '',
      [STUDENT_FORM_FIELDS.MEDICAL_NOTES]: ''
    },
    mode: 'onChange'
  })

  const { handleSubmit, formState, reset, watch } = form
  const { errors, isDirty, isValid } = formState

  // Watch form values for auto-save
  const watchedValues = watch()

  // ============================================================================
  // AUTO-SAVE FUNCTIONALITY
  // ============================================================================

  const saveFormDraft = useCallback(async (data: StudentFormSchema) => {
    if (!autoSaveEnabled || !isDirty) return

    setAutoSaveStatus('saving')
    try {
      // Save to localStorage as draft
      const draftKey = `student-form-draft-${initialData?.id || 'new'}`
      localStorage.setItem(draftKey, JSON.stringify(data))
      setAutoSaveStatus('saved')
      
      // Reset status after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Auto-save error:', error)
      setAutoSaveStatus('error')
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    }
  }, [autoSaveEnabled, isDirty, initialData?.id])

  // Auto-save when form values change (debounced)
  useEffect(() => {
    if (!autoSaveEnabled) return

    const timer = setTimeout(() => {
      if (isDirty && isValid) {
        saveFormDraft(watchedValues)
      }
    }, 2000) // 2 second debounce

    return () => clearTimeout(timer)
  }, [watchedValues, isDirty, isValid, saveFormDraft, autoSaveEnabled])

  // Load draft on mount
  useEffect(() => {
    if (mode === 'create' && !initialData) {
      const draftKey = 'student-form-draft-new'
      const savedDraft = localStorage.getItem(draftKey)
      
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft)
          reset(draftData)
          setAutoSaveEnabled(true)
        } catch (error) {
          console.error('Error loading draft:', error)
          localStorage.removeItem(draftKey)
        }
      }
    }
  }, [mode, initialData, reset])

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const onFormSubmit = async (data: StudentFormSchema) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const studentData = formDataToStudentData(data)
      await onSubmit(studentData)
      
      // Clear draft on successful submit
      if (autoSaveEnabled) {
        const draftKey = `student-form-draft-${initialData?.id || 'new'}`
        localStorage.removeItem(draftKey)
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      setSubmitError(error?.message || STUDENT_ERROR_MESSAGES.VALIDATION_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = useCallback(() => {
    reset()
    setSubmitError(null)
    
    // Clear draft
    if (autoSaveEnabled) {
      const draftKey = `student-form-draft-${initialData?.id || 'new'}`
      localStorage.removeItem(draftKey)
    }
  }, [reset, autoSaveEnabled, initialData?.id])

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (!confirmLeave) return
    }
    
    onCancel()
  }, [isDirty, onCancel])

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderAutoSaveStatus = () => {
    if (!autoSaveEnabled) return null

    const statusConfig = {
      idle: { text: '', className: '' },
      saving: { text: 'Saving draft...', className: 'text-muted-foreground' },
      saved: { text: 'Draft saved', className: 'text-green-600' },
      error: { text: 'Save failed', className: 'text-destructive' }
    }

    const config = statusConfig[autoSaveStatus]
    if (!config.text) return null

    return (
      <div className={cn('text-xs', config.className)}>
        {config.text}
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {mode === 'create' ? 'Add New Student' : 'Edit Student'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {mode === 'create' 
              ? 'Enter student information to create a new enrollment'
              : 'Update student information and save changes'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {renderAutoSaveStatus()}
          {mode === 'create' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            >
              Auto-save: {autoSaveEnabled ? 'On' : 'Off'}
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <div className="text-sm text-destructive font-medium">
            Error submitting form
          </div>
          <div className="text-sm text-destructive/80 mt-1">
            {submitError}
          </div>
        </div>
      )}

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  1
                </span>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <Controller
                  name={STUDENT_FORM_FIELDS.FULL_NAME}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter student's full name"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />

                {/* Date of Birth */}
                <Controller
                  name={STUDENT_FORM_FIELDS.DATE_OF_BIRTH}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>Date of Birth</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            placeholder="YYYY-MM-DD"
                            {...field}
                            disabled={loading || isSubmitting}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormDescription>
                          Student must be between {VALIDATION_RULES.MIN_STUDENT_AGE} and {VALIDATION_RULES.MAX_STUDENT_AGE} years old
                        </FormDescription>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* School Name */}
                <Controller
                  name={STUDENT_FORM_FIELDS.SCHOOL_NAME}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>School Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter school name"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />

                {/* Grade Level */}
                <Controller
                  name={STUDENT_FORM_FIELDS.GRADE_LEVEL}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>Grade Level</FormLabel>
                        <FormControl>
                          <Select 
                            {...field}
                            disabled={loading || isSubmitting}
                          >
                            <option value="">Select grade level</option>
                            {Object.entries(STUDENT_GRADES).map(([key, value]) => (
                              <option key={key} value={value}>
                                {STUDENT_GRADE_LABELS[value as keyof typeof STUDENT_GRADE_LABELS]}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  2
                </span>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parent Email */}
                <Controller
                  name={STUDENT_FORM_FIELDS.PARENT_EMAIL}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>Parent Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="parent@example.com"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Primary contact email for communication
                        </FormDescription>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />

                {/* Parent Phone */}
                <Controller
                  name={STUDENT_FORM_FIELDS.PARENT_PHONE}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel required>Parent Phone</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Include country code for international numbers
                        </FormDescription>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <Controller
                  name={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Emergency contact name (optional)"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Alternative contact person if parent unavailable
                        </FormDescription>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />

                {/* Emergency Contact Phone */}
                <Controller
                  name={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Emergency contact phone (optional)"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Program Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  3
                </span>
                Program Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skill Level */}
              <Controller
                name={STUDENT_FORM_FIELDS.SKILL_LEVEL}
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormField name={field.name}>
                    <FormItem>
                      <FormLabel required>Programming Skill Level</FormLabel>
                      <FormControl>
                        <Select 
                          {...field}
                          disabled={loading || isSubmitting}
                        >
                          {Object.entries(STUDENT_SKILL_LEVELS).map(([key, value]) => (
                            <option key={key} value={value}>
                              {STUDENT_SKILL_LEVEL_LABELS[value as keyof typeof STUDENT_SKILL_LEVEL_LABELS]}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormDescription>
                        {field.value && STUDENT_SKILL_LEVEL_DESCRIPTIONS[field.value as keyof typeof STUDENT_SKILL_LEVEL_DESCRIPTIONS]}
                      </FormDescription>
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  </FormField>
                )}
              />

              {/* Special Requirements */}
              <Controller
                name={STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS}
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormField name={field.name}>
                    <FormItem>
                      <FormLabel>Special Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special accommodations, learning needs, or accessibility requirements (optional)"
                          className="min-h-[100px]"
                          {...field}
                          disabled={loading || isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum {VALIDATION_RULES.SPECIAL_REQUIREMENTS_MAX_LENGTH} characters
                      </FormDescription>
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  </FormField>
                )}
              />

              {/* Medical Notes */}
              <Controller
                name={STUDENT_FORM_FIELDS.MEDICAL_NOTES}
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormField name={field.name}>
                    <FormItem>
                      <FormLabel>Medical Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any medical conditions, allergies, or health information we should know (optional)"
                          className="min-h-[100px]"
                          {...field}
                          disabled={loading || isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Confidential information - Maximum {VALIDATION_RULES.MEDICAL_NOTES_MAX_LENGTH} characters
                      </FormDescription>
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  </FormField>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading || isSubmitting || !isValid}
              className="sm:order-2 flex-1 sm:flex-initial"
            >
              {(loading || isSubmitting) && <LoadingSpinner className="mr-2 h-4 w-4" />}
              {mode === 'create' ? 'Create Student' : 'Save Changes'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading || isSubmitting || !isDirty}
              className="sm:order-1"
            >
              Reset Form
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading || isSubmitting}
              className="sm:order-3"
            >
              Cancel
            </Button>
          </div>

          {/* Form Status */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Form Status: {isDirty ? 'Modified' : 'Clean'}</div>
            <div>Validation: {isValid ? 'Valid' : 'Invalid'}</div>
            {Object.keys(errors).length > 0 && (
              <div className="text-destructive">
                {Object.keys(errors).length} field(s) have errors
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default StudentForm
