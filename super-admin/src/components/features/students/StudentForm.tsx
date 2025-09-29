/**
 * Optimized Student Form Component
 * 
 * Professional desktop-optimized form component for creating and editing students with:
 * - React Hook Form integration with Zod validation
 * - Database schema exact matching
 * - Real-time validation and error handling
 * - Responsive design for desktop/tablet/mobile
 * - Clean, professional UI/UX
 * - Accessibility features
 * 
 * Matches database constraints exactly and uses constants throughout
 * 
 * @file StudentForm.tsx
 * @version 2.0.0
 */

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import type { Student, StudentFormData } from '../../../types/student.types'
import {
  STUDENT_FORM_FIELDS,
  STUDENT_GRADES,
  STUDENT_GRADE_LABELS,
  STUDENT_SKILL_LEVELS,
  STUDENT_SKILL_LEVEL_LABELS,
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  STUDENT_ERROR_MESSAGES
} from '../../../constants/student.constants'

// UI Components
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Select } from '../../ui/Select'
import { Textarea } from '../../ui/Textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
  
  [STUDENT_FORM_FIELDS.PARENT_NAME]: z
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
  [STUDENT_FORM_FIELDS.PARENT_NAME]: student.parent_name,
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
  parent_name: formData[STUDENT_FORM_FIELDS.PARENT_NAME],
  date_of_birth: formData[STUDENT_FORM_FIELDS.DATE_OF_BIRTH],
  school_name: formData[STUDENT_FORM_FIELDS.SCHOOL_NAME],
  grade_level: formData[STUDENT_FORM_FIELDS.GRADE_LEVEL],
  parent_email: formData[STUDENT_FORM_FIELDS.PARENT_EMAIL],
  parent_phone: formData[STUDENT_FORM_FIELDS.PARENT_PHONE],
  emergency_contact_name: formData[STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME] || undefined,
  emergency_contact_phone: formData[STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE] || undefined,
  skill_level: formData[STUDENT_FORM_FIELDS.SKILL_LEVEL],
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

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData ? studentToFormData(initialData) : {
      [STUDENT_FORM_FIELDS.FULL_NAME]: '',
      [STUDENT_FORM_FIELDS.PARENT_NAME]: '',
      [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: '',
      [STUDENT_FORM_FIELDS.SCHOOL_NAME]: '',
      [STUDENT_FORM_FIELDS.GRADE_LEVEL]: '',
      [STUDENT_FORM_FIELDS.PARENT_EMAIL]: '',
      [STUDENT_FORM_FIELDS.PARENT_PHONE]: '',
      [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME]: '',
      [STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE]: '',
      [STUDENT_FORM_FIELDS.SKILL_LEVEL]: '' as unknown as typeof STUDENT_SKILL_LEVELS[keyof typeof STUDENT_SKILL_LEVELS],
      [STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS]: '',
      [STUDENT_FORM_FIELDS.MEDICAL_NOTES]: ''
    },
    mode: 'onChange'
  })

  const { handleSubmit, formState } = form
  const { isDirty, isValid } = formState

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const onFormSubmit = async (data: StudentFormSchema) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const studentData = formDataToStudentData(data)
      await onSubmit(studentData)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError((error as Error)?.message || STUDENT_ERROR_MESSAGES.VALIDATION_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }


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

  /**
   * Standard Field Component
   */
  interface StandardFieldProps {
    name: keyof StudentFormSchema
    label: string
    required?: boolean
    placeholder: string
    type?: 'text' | 'email' | 'tel' | 'date'
    className?: string
  }

  const StandardField = ({ 
    name, 
    label, 
    required = false, 
    placeholder, 
    type = 'text',
    className
  }: StandardFieldProps) => (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FormField name={field.name}>
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input 
                type={type}
                placeholder={placeholder}
                {...field}
                disabled={loading || isSubmitting}
                className="mt-1"
              />
            </FormControl>
            {/* MVP: help text removed to reduce visual noise */}
            <FormMessage error={fieldState.error} />
          </FormItem>
        </FormField>
      )}
    />
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const [showOptional, setShowOptional] = useState(false)

  return (
    <div className="p-6 space-y-8">
      {/* Form Header */}
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Add New Student' : 'Edit Student'}
        </h2>
        <p className="text-gray-600 mt-1">Basic info. * Required</p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800 font-medium">
            Error submitting form
          </div>
          <div className="text-sm text-red-700 mt-1">
            {submitError}
          </div>
        </div>
      )}

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Single-column, natural order */}
          <div className="space-y-4">
            <StandardField
              name={STUDENT_FORM_FIELDS.FULL_NAME}
              label="Student Name"
              required
              placeholder="Student's full name"
            />
            <StandardField
              name={STUDENT_FORM_FIELDS.PARENT_NAME as keyof StudentFormSchema}
              label="Parent/Guardian Name"
              required
              placeholder="Parent or guardian full name"
            />
            <StandardField
              name={STUDENT_FORM_FIELDS.DATE_OF_BIRTH}
              label="Date of Birth"
              required
              placeholder="YYYY-MM-DD"
              type="date"
            />
            <Controller
              name={STUDENT_FORM_FIELDS.GRADE_LEVEL}
              control={form.control}
              render={({ field, fieldState }) => (
                <FormField name={field.name}>
                  <FormItem>
                    <FormLabel>
                      Grade Level <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        disabled={loading || isSubmitting}
                      >
                        <option value="">Select grade</option>
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
            <StandardField
              name={STUDENT_FORM_FIELDS.SCHOOL_NAME}
              label="School Name"
              required
              placeholder="Current school"
            />
            <Controller
              name={STUDENT_FORM_FIELDS.SKILL_LEVEL}
              control={form.control}
              render={({ field, fieldState }) => (
                <FormField name={field.name}>
                  <FormItem>
                    <FormLabel>
                      Skill Level <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select {...field} disabled={loading || isSubmitting}>
                        <option value="">Select skill level</option>
                        {Object.entries(STUDENT_SKILL_LEVELS).map(([key, value]) => (
                          <option key={key} value={value}>
                            {STUDENT_SKILL_LEVEL_LABELS[value as keyof typeof STUDENT_SKILL_LEVEL_LABELS]}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage error={fieldState.error} />
                  </FormItem>
                </FormField>
              )}
            />
            {/* Parent/Guardian details */}
            <StandardField
              name={STUDENT_FORM_FIELDS.PARENT_EMAIL}
              label="Parent Email"
              required
              placeholder="parent@example.com"
              type="email"
            />
            <StandardField
              name={STUDENT_FORM_FIELDS.PARENT_PHONE}
              label="Parent Phone"
              required
              placeholder="+61 123 456 789"
              type="tel"
            />
          </div>

          {/* Optional details */}
          <div className="pt-2 border-t">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => setShowOptional(v => !v)}
            >
              {showOptional ? 'Hide optional details' : 'Add optional details'}
            </Button>
            {showOptional && (
              <div className="mt-4 space-y-4">
                <StandardField
                  name={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME}
                  label="Emergency Contact Name"
                  placeholder="Emergency contact (optional)"
                />
                <StandardField
                  name={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE}
                  label="Emergency Contact Phone"
                  placeholder="Emergency phone (optional)"
                  type="tel"
                />
                <Controller
                  name={STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Learning needs or accommodations (optional)"
                            className="min-h-[80px]"
                            {...field}
                            disabled={loading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage error={fieldState.error} />
                      </FormItem>
                    </FormField>
                  )}
                />
                <Controller
                  name={STUDENT_FORM_FIELDS.MEDICAL_NOTES}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormField name={field.name}>
                      <FormItem>
                        <FormLabel>Medical Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Health information (optional)"
                            className="min-h-[80px]"
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
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                mode === 'create' ? 'Create Student' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default StudentForm
