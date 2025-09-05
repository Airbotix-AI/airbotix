/**
 * Student Form Component
 * Comprehensive form for adding and editing student information
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Label } from '../../ui/Label';
import { Card } from '../../ui/Card';
import { useStudentForm } from '../../../hooks/useStudents';
import type { Student, StudentFormData } from '../../../types/student.types';
import {
  STUDENT_STATUS,
  STUDENT_SKILL_LEVELS,
  STUDENT_GRADES,
  STUDENT_UI_TEXT,
  STUDENT_FORM_FIELDS,
  VALIDATION_RULES
} from '../../../constants/student.constants';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const studentFormSchema = z.object({
  name: z.string()
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, STUDENT_UI_TEXT.NAME_TOO_SHORT)
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, STUDENT_UI_TEXT.NAME_TOO_LONG),
  
  dateOfBirth: z.string()
    .min(1, STUDENT_UI_TEXT.DATE_OF_BIRTH_REQUIRED)
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, STUDENT_UI_TEXT.DATE_OF_BIRTH_FUTURE)
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= VALIDATION_RULES.MIN_AGE && age <= VALIDATION_RULES.MAX_AGE;
    }, STUDENT_UI_TEXT.DATE_OF_BIRTH_TOO_OLD),
  
  school: z.string()
    .min(1, STUDENT_UI_TEXT.SCHOOL_REQUIRED)
    .max(VALIDATION_RULES.SCHOOL_MAX_LENGTH, STUDENT_UI_TEXT.SCHOOL_TOO_LONG),
  
  grade: z.string()
    .min(1, STUDENT_UI_TEXT.GRADE_REQUIRED),
  
  parentEmail: z.string()
    .min(1, STUDENT_UI_TEXT.PARENT_EMAIL_REQUIRED)
    .email(STUDENT_UI_TEXT.PARENT_EMAIL_INVALID)
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, 'Email too long'),
  
  parentPhone: z.string()
    .min(VALIDATION_RULES.PHONE_MIN_LENGTH, STUDENT_UI_TEXT.PARENT_PHONE_INVALID)
    .max(VALIDATION_RULES.PHONE_MAX_LENGTH, 'Phone number too long'),
  
  emergencyContactName: z.string()
    .min(1, STUDENT_UI_TEXT.EMERGENCY_CONTACT_NAME_REQUIRED),
  
  emergencyContactPhone: z.string()
    .min(VALIDATION_RULES.PHONE_MIN_LENGTH, STUDENT_UI_TEXT.EMERGENCY_CONTACT_PHONE_INVALID)
    .max(VALIDATION_RULES.PHONE_MAX_LENGTH, 'Phone number too long'),
  
  emergencyContactRelation: z.string()
    .min(1, STUDENT_UI_TEXT.EMERGENCY_CONTACT_RELATION_REQUIRED),
  
  skillLevel: z.string()
    .min(1, STUDENT_UI_TEXT.SKILL_LEVEL_REQUIRED),
  
  status: z.string()
    .min(1, STUDENT_UI_TEXT.STATUS_REQUIRED),
  
  specialRequirements: z.string()
    .max(VALIDATION_RULES.NOTES_MAX_LENGTH, 'Notes too long')
    .optional(),
  
  progressComments: z.string()
    .max(VALIDATION_RULES.NOTES_MAX_LENGTH, 'Notes too long')
    .optional(),
  
  medicalNotes: z.string()
    .max(VALIDATION_RULES.NOTES_MAX_LENGTH, 'Notes too long')
    .optional(),
});

type StudentFormSchema = z.infer<typeof studentFormSchema>;

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

// ============================================================================
// STUDENT FORM COMPONENT
// ============================================================================

export function StudentForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode
}: StudentFormProps) {
  const {
    formData,
    errors,
    loading: hookLoading,
    setFormData,
    setField,
    validate,
    reset,
    submit
  } = useStudentForm(initialData);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset: formReset,
    watch
  } = useForm<StudentFormSchema>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      school: initialData?.school || '',
      grade: initialData?.grade || '',
      parentEmail: initialData?.parentEmail || '',
      parentPhone: initialData?.parentPhone || '',
      emergencyContactName: initialData?.emergencyContactName || '',
      emergencyContactPhone: initialData?.emergencyContactPhone || '',
      emergencyContactRelation: initialData?.emergencyContactRelation || '',
      skillLevel: initialData?.skillLevel || '',
      status: initialData?.status || '',
      specialRequirements: initialData?.specialRequirements || '',
      progressComments: initialData?.progressComments || '',
      medicalNotes: initialData?.medicalNotes || ''
    }
  });

  // Sync form data with hook
  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as StudentFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  // Handle form submission
  const handleFormSubmit = async (data: StudentFormSchema) => {
    try {
      await onSubmit(data as StudentFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    formReset();
    onCancel();
  };

  const isSubmitting = loading || hookLoading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{STUDENT_UI_TEXT.PERSONAL_INFORMATION}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.NAME}>
              {STUDENT_UI_TEXT.STUDENT_NAME} *
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.NAME}
                  placeholder={STUDENT_UI_TEXT.NAME_PLACEHOLDER}
                  className={formErrors.name ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.DATE_OF_BIRTH}>
              {STUDENT_UI_TEXT.DATE_OF_BIRTH} *
            </Label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.DATE_OF_BIRTH}
                  type="date"
                  className={formErrors.dateOfBirth ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.dateOfBirth && (
              <p className="text-sm text-destructive">{formErrors.dateOfBirth.message}</p>
            )}
          </div>

          {/* School */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.SCHOOL}>
              {STUDENT_UI_TEXT.SCHOOL_NAME} *
            </Label>
            <Controller
              name="school"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.SCHOOL}
                  placeholder={STUDENT_UI_TEXT.SCHOOL_PLACEHOLDER}
                  className={formErrors.school ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.school && (
              <p className="text-sm text-destructive">{formErrors.school.message}</p>
            )}
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.GRADE}>
              {STUDENT_UI_TEXT.GRADE_LEVEL} *
            </Label>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id={STUDENT_FORM_FIELDS.GRADE}
                  className={formErrors.grade ? 'border-destructive' : ''}
                >
                  <option value="">Select Grade</option>
                  {Object.entries(STUDENT_GRADES).map(([key, value]) => (
                    <option key={key} value={value}>
                      Grade {value}
                    </option>
                  ))}
                </Select>
              )}
            />
            {formErrors.grade && (
              <p className="text-sm text-destructive">{formErrors.grade.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{STUDENT_UI_TEXT.CONTACT_INFORMATION}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent Email */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.PARENT_EMAIL}>
              {STUDENT_UI_TEXT.PARENT_EMAIL_ADDRESS} *
            </Label>
            <Controller
              name="parentEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.PARENT_EMAIL}
                  type="email"
                  placeholder={STUDENT_UI_TEXT.EMAIL_PLACEHOLDER}
                  className={formErrors.parentEmail ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.parentEmail && (
              <p className="text-sm text-destructive">{formErrors.parentEmail.message}</p>
            )}
          </div>

          {/* Parent Phone */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.PARENT_PHONE}>
              {STUDENT_UI_TEXT.PARENT_PHONE_NUMBER} *
            </Label>
            <Controller
              name="parentPhone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.PARENT_PHONE}
                  type="tel"
                  placeholder={STUDENT_UI_TEXT.PHONE_PLACEHOLDER}
                  className={formErrors.parentPhone ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.parentPhone && (
              <p className="text-sm text-destructive">{formErrors.parentPhone.message}</p>
            )}
          </div>

          {/* Emergency Contact Name */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME}>
              {STUDENT_UI_TEXT.EMERGENCY_CONTACT} *
            </Label>
            <Controller
              name="emergencyContactName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_NAME}
                  placeholder="Emergency contact name"
                  className={formErrors.emergencyContactName ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.emergencyContactName && (
              <p className="text-sm text-destructive">{formErrors.emergencyContactName.message}</p>
            )}
          </div>

          {/* Emergency Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE}>
              {STUDENT_UI_TEXT.EMERGENCY_PHONE} *
            </Label>
            <Controller
              name="emergencyContactPhone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_PHONE}
                  type="tel"
                  placeholder={STUDENT_UI_TEXT.PHONE_PLACEHOLDER}
                  className={formErrors.emergencyContactPhone ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.emergencyContactPhone && (
              <p className="text-sm text-destructive">{formErrors.emergencyContactPhone.message}</p>
            )}
          </div>

          {/* Emergency Contact Relation */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_RELATION}>
              {STUDENT_UI_TEXT.RELATIONSHIP} *
            </Label>
            <Controller
              name="emergencyContactRelation"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id={STUDENT_FORM_FIELDS.EMERGENCY_CONTACT_RELATION}
                  className={formErrors.emergencyContactRelation ? 'border-destructive' : ''}
                >
                  <option value="">Select Relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="aunt">Aunt</option>
                  <option value="uncle">Uncle</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </Select>
              )}
            />
            {formErrors.emergencyContactRelation && (
              <p className="text-sm text-destructive">{formErrors.emergencyContactRelation.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Program Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{STUDENT_UI_TEXT.PROGRAM_INFORMATION}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skill Level */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.SKILL_LEVEL}>
              {STUDENT_UI_TEXT.SKILL_LEVEL} *
            </Label>
            <Controller
              name="skillLevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id={STUDENT_FORM_FIELDS.SKILL_LEVEL}
                  className={formErrors.skillLevel ? 'border-destructive' : ''}
                >
                  <option value="">Select Skill Level</option>
                  {Object.entries(STUDENT_SKILL_LEVELS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </Select>
              )}
            />
            {formErrors.skillLevel && (
              <p className="text-sm text-destructive">{formErrors.skillLevel.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.STATUS}>
              {STUDENT_UI_TEXT.STUDENT_STATUS} *
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id={STUDENT_FORM_FIELDS.STATUS}
                  className={formErrors.status ? 'border-destructive' : ''}
                >
                  <option value="">Select Status</option>
                  {Object.entries(STUDENT_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </Select>
              )}
            />
            {formErrors.status && (
              <p className="text-sm text-destructive">{formErrors.status.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Notes and Special Requirements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{STUDENT_UI_TEXT.NOTES_AND_REQUIREMENTS}</h3>
        <div className="space-y-4">
          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS}>
              {STUDENT_UI_TEXT.SPECIAL_REQUIREMENTS}
            </Label>
            <Controller
              name="specialRequirements"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id={STUDENT_FORM_FIELDS.SPECIAL_REQUIREMENTS}
                  placeholder={STUDENT_UI_TEXT.NOTES_PLACEHOLDER}
                  rows={3}
                  className={formErrors.specialRequirements ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.specialRequirements && (
              <p className="text-sm text-destructive">{formErrors.specialRequirements.message}</p>
            )}
          </div>

          {/* Progress Comments */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.PROGRESS_COMMENTS}>
              {STUDENT_UI_TEXT.PROGRESS_COMMENTS}
            </Label>
            <Controller
              name="progressComments"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id={STUDENT_FORM_FIELDS.PROGRESS_COMMENTS}
                  placeholder="Progress comments and observations..."
                  rows={3}
                  className={formErrors.progressComments ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.progressComments && (
              <p className="text-sm text-destructive">{formErrors.progressComments.message}</p>
            )}
          </div>

          {/* Medical Notes */}
          <div className="space-y-2">
            <Label htmlFor={STUDENT_FORM_FIELDS.MEDICAL_NOTES}>
              {STUDENT_UI_TEXT.MEDICAL_NOTES}
            </Label>
            <Controller
              name="medicalNotes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id={STUDENT_FORM_FIELDS.MEDICAL_NOTES}
                  placeholder="Medical conditions, allergies, medications..."
                  rows={3}
                  className={formErrors.medicalNotes ? 'border-destructive' : ''}
                />
              )}
            />
            {formErrors.medicalNotes && (
              <p className="text-sm text-destructive">{formErrors.medicalNotes.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          {STUDENT_UI_TEXT.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'create' ? STUDENT_UI_TEXT.SAVING : STUDENT_UI_TEXT.UPDATING}
            </>
          ) : (
            mode === 'create' ? STUDENT_UI_TEXT.SAVE_STUDENT : STUDENT_UI_TEXT.UPDATE_STUDENT
          )}
        </Button>
      </div>
    </form>
  );
}
