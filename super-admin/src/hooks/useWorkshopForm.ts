// Workshop Form Management Hook
// Provides comprehensive form state management, validation, and submission for workshop forms

import { useState, useCallback, useEffect } from 'react'
import { workshopService } from '@/services'
import type {
  NewWorkshop,
  WorkshopFormData,
} from '@/types'
import {
  WORKSHOP_VALIDATION_MESSAGES,
  WORKSHOP_SUCCESS_MESSAGES,
  WORKSHOP_ERROR_MESSAGES,
} from '@/constants/workshop'

// Form state interface
export interface UseWorkshopFormState {
  formData: WorkshopFormData
  errors: Record<string, string>
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
  submitError: string | null
  submitSuccess: string | null
}

// Hook return interface
export interface UseWorkshopFormReturn extends UseWorkshopFormState {
  // Form field setters
  setField: (field: keyof WorkshopFormData, value: any) => void
  setFields: (fields: Partial<WorkshopFormData>) => void
  
  // Array field operations
  addHighlight: (highlight: string) => void
  removeHighlight: (index: number) => void
  updateHighlight: (index: number, highlight: string) => void
  
  addSyllabusDay: (day: any) => void
  removeSyllabusDay: (index: number) => void
  updateSyllabusDay: (index: number, day: any) => void
  
  addMaterial: (category: 'hardware' | 'software' | 'onlineResources', item: string) => void
  removeMaterial: (category: 'hardware' | 'software' | 'onlineResources', index: number) => void
  updateMaterial: (category: 'hardware' | 'software' | 'onlineResources', index: number, item: string) => void
  
  addAssessment: (assessment: any) => void
  removeAssessment: (index: number) => void
  updateAssessment: (index: number, assessment: any) => void
  
  addLearningOutcome: (outcome: string) => void
  removeLearningOutcome: (index: number) => void
  updateLearningOutcome: (index: number, outcome: string) => void
  
  addPhoto: (photo: any) => void
  removePhoto: (index: number) => void
  updatePhoto: (index: number, photo: any) => void
  
  // Form operations
  reset: () => void
  validate: () => boolean
  validateField: (field: keyof WorkshopFormData) => boolean
  validateFieldOnBlur: (field: keyof WorkshopFormData) => void
  submit: () => Promise<NewWorkshop | null>
  loadWorkshop: (workshop: NewWorkshop) => void
  
  // Utility functions
  clearErrors: () => void
  clearSuccess: () => void
  hasFieldError: (field: keyof WorkshopFormData) => boolean
  getFieldError: (field: keyof WorkshopFormData) => string | null
  getFieldRequirements: (field: keyof WorkshopFormData) => string
}

// Default form data
const DEFAULT_FORM_DATA: WorkshopFormData = {
  title: '',
  subtitle: '',
  overview: '',
  duration: '',
  targetAudience: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  status: 'draft',
  highlights: [''],
  syllabus: [{
    day: 1,
    title: '',
    objective: '',
    activities: [''],
  }],
  materials: {
    hardware: [''],
    software: [''],
    onlineResources: [''],
  },
  assessment: [{
    item: '',
    weight: '',
    criteria: '',
  }],
  learningOutcomes: [''],
  media: {
    video: {
      src: '',
      poster: '',
      caption: '',
    },
    photos: [{
      src: '',
      alt: '',
    }],
  },
  seo: {
    title: '',
    description: '',
  },
  source: '',
}

export function useWorkshopForm(initialData?: Partial<WorkshopFormData>): UseWorkshopFormReturn {
  // State management
  const [state, setState] = useState<UseWorkshopFormState>({
    formData: { ...DEFAULT_FORM_DATA, ...initialData },
    errors: {},
    isSubmitting: false,
    isDirty: false,
    isValid: false,
    submitError: null,
    submitSuccess: null,
  })

  // URL validation helper
  const isValidUrl = useCallback((url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [])

  // Validation function
  const validateField = useCallback((field: keyof WorkshopFormData, formDataOverride?: WorkshopFormData): boolean => {
    const data = formDataOverride || state.formData
    const value = data[field]
    
    // Basic required field validation
    if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: `${field} is required` },
        }))
        return false
    }

    // Array validation
    if (Array.isArray(value)) {
        if (value.length === 0) {
            setState(prev => ({
              ...prev,
              errors: { ...prev.errors, [field]: `${field} must have at least 1 item` },
            }))
            return false
        }
        
        // Check for empty strings in array
        const hasEmptyItems = value.some(item => 
            typeof item === 'string' && item.trim().length === 0
        )
        if (hasEmptyItems) {
            setState(prev => ({
              ...prev,
              errors: { ...prev.errors, [field]: `${field} cannot contain empty items` },
            }))
            return false
        }
    }

    // Date validation
    if (field === 'endDate' && data.startDate && typeof value === 'string') {
        const startDate = new Date(data.startDate + 'T00:00:00')
        const endDate = new Date(value + 'T00:00:00')
        if (endDate <= startDate) {
          setState(prev => ({
            ...prev,
            errors: { ...prev.errors, [field]: WORKSHOP_VALIDATION_MESSAGES.END_DATE_BEFORE_START },
          }))
          return false
        }
    }

    // Materials validation
    if (field === 'materials' && value && typeof value === 'object') {
        const materials = value as any
        const categories = ['hardware', 'software', 'onlineResources']
        for (const category of categories) {
            if (!materials[category] || !Array.isArray(materials[category]) || materials[category].length === 0) {
                setState(prev => ({
                  ...prev,
                  errors: { ...prev.errors, [field]: `${category} must have at least 1 item` },
                }))
                return false
            }
            // Check for empty items in each category
            const hasEmptyItems = materials[category].some((item: string) => item.trim().length === 0)
            if (hasEmptyItems) {
                setState(prev => ({
                  ...prev,
                  errors: { ...prev.errors, [field]: `${category} cannot contain empty items` },
                }))
                return false
            }
        }
    }

    // URL validation
    if (field === 'media' && value && typeof value === 'object') {
        const media = value as any
        if (media.video && media.video.src && !isValidUrl(media.video.src)) {
          setState(prev => ({
            ...prev,
            errors: { ...prev.errors, [field]: 'Invalid video URL format' },
          }))
          return false
        }
        if (media.photos && Array.isArray(media.photos)) {
            const hasEmptyPhotos = media.photos.some((photo: any) => !photo.src || photo.src.trim().length === 0)
            if (hasEmptyPhotos) {
                setState(prev => ({
                  ...prev,
                  errors: { ...prev.errors, [field]: 'Photo URLs cannot be empty' },
                }))
                return false
            }
        }
    }

    // Clear error if validation passes
    setState(prev => {
      const newErrors = { ...prev.errors }
      delete newErrors[field]
      return { ...prev, errors: newErrors }
    })

    return true
  }, [state.formData, isValidUrl])

  // Validate all fields
  const validate = useCallback((): boolean => {
    const fields: (keyof WorkshopFormData)[] = [
      'title', 'subtitle', 'overview', 'duration', 'targetAudience', 'startDate', 'endDate',
      'status', 'highlights', 'syllabus', 'materials', 'assessment',
      'learningOutcomes', 'media', 'seo', 'source'
    ]

    let isValid = true
    const errors: Record<string, string> = {}

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false
      }
    })

    setState(prev => ({ ...prev, isValid, errors }))
    return isValid
  }, [validateField])

  // Set single field
  const setField = useCallback((field: keyof WorkshopFormData, value: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      isDirty: true,
      submitError: null,
      submitSuccess: null,
    }))
  }, [])

  // Validate field on blur
  const validateFieldOnBlur = useCallback((field: keyof WorkshopFormData) => {
    validateField(field)
  }, [validateField])

  // Get field requirements
  const getFieldRequirements = useCallback((field: keyof WorkshopFormData): string => {
    const requirements: Record<string, string> = {
      title: 'Title is required',
      subtitle: 'Subtitle is required',
      overview: 'Overview is required',
      duration: 'Duration is required',
      targetAudience: 'Target audience is required',
      startDate: 'Start date is required',
      endDate: 'End date must be after start date',
      status: 'Status is required',
      highlights: 'At least 1 highlight is required',
      syllabus: 'At least 1 syllabus day is required',
      materials: 'At least 1 item required in each material category',
      assessment: 'At least 1 assessment item is required',
      learningOutcomes: 'At least 1 learning outcome is required',
      media: 'Video URL and at least 1 photo are required',
      seo: 'SEO title and description are required',
      source: 'Source is required',
    }
    return requirements[field] || 'This field is required'
  }, [])

  // Set multiple fields
  const setFields = useCallback((fields: Partial<WorkshopFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...fields },
      isDirty: true,
      submitError: null,
      submitSuccess: null,
    }))

    // Validate all changed fields
    Object.keys(fields).forEach(field => {
      setTimeout(() => validateField(field as keyof WorkshopFormData), 0)
    })
  }, [validateField])

  // Array field operations - Highlights
  const addHighlight = useCallback((highlight: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        highlights: [...prev.formData.highlights, highlight],
      },
      isDirty: true,
    }))
  }, [])

  const removeHighlight = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        highlights: prev.formData.highlights.filter((_, i) => i !== index),
      },
      isDirty: true,
    }))
  }, [])

  const updateHighlight = useCallback((index: number, highlight: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        highlights: prev.formData.highlights.map((h, i) => i === index ? highlight : h),
      },
      isDirty: true,
    }))
  }, [])

  // Array field operations - Syllabus
  const addSyllabusDay = useCallback((day: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        syllabus: [...prev.formData.syllabus, day],
      },
      isDirty: true,
    }))
  }, [])

  const removeSyllabusDay = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        syllabus: prev.formData.syllabus.filter((_, i) => i !== index),
      },
      isDirty: true,
    }))
  }, [])

  const updateSyllabusDay = useCallback((index: number, day: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        syllabus: prev.formData.syllabus.map((d, i) => i === index ? day : d),
      },
      isDirty: true,
    }))
  }, [])

  // Array field operations - Materials
  const addMaterial = useCallback((category: 'hardware' | 'software' | 'onlineResources', item: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        materials: {
          ...prev.formData.materials,
          [category]: [...prev.formData.materials[category], item],
        },
      },
      isDirty: true,
    }))
  }, [])

  const removeMaterial = useCallback((category: 'hardware' | 'software' | 'onlineResources', index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        materials: {
          ...prev.formData.materials,
          [category]: prev.formData.materials[category].filter((_, i) => i !== index),
        },
      },
      isDirty: true,
    }))
  }, [])

  const updateMaterial = useCallback((category: 'hardware' | 'software' | 'onlineResources', index: number, item: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        materials: {
          ...prev.formData.materials,
          [category]: prev.formData.materials[category].map((m, i) => i === index ? item : m),
        },
      },
      isDirty: true,
    }))
  }, [])

  // Array field operations - Assessment
  const addAssessment = useCallback((assessment: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        assessment: [...prev.formData.assessment, assessment],
      },
      isDirty: true,
    }))
  }, [])

  const removeAssessment = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        assessment: prev.formData.assessment.filter((_, i) => i !== index),
      },
      isDirty: true,
    }))
  }, [])

  const updateAssessment = useCallback((index: number, assessment: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        assessment: prev.formData.assessment.map((a, i) => i === index ? assessment : a),
      },
      isDirty: true,
    }))
  }, [])

  // Array field operations - Learning Outcomes
  const addLearningOutcome = useCallback((outcome: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        learningOutcomes: [...prev.formData.learningOutcomes, outcome],
      },
      isDirty: true,
    }))
  }, [])

  const removeLearningOutcome = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        learningOutcomes: prev.formData.learningOutcomes.filter((_, i) => i !== index),
      },
      isDirty: true,
    }))
  }, [])

  const updateLearningOutcome = useCallback((index: number, outcome: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        learningOutcomes: prev.formData.learningOutcomes.map((o, i) => i === index ? outcome : o),
      },
      isDirty: true,
    }))
  }, [])

  // Array field operations - Photos
  const addPhoto = useCallback((photo: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        media: {
          ...prev.formData.media,
          photos: [...prev.formData.media.photos, photo],
        },
      },
      isDirty: true,
    }))
  }, [])

  const removePhoto = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        media: {
          ...prev.formData.media,
          photos: prev.formData.media.photos.filter((_, i) => i !== index),
        },
      },
      isDirty: true,
    }))
  }, [])

  const updatePhoto = useCallback((index: number, photo: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        media: {
          ...prev.formData.media,
          photos: prev.formData.media.photos.map((p, i) => i === index ? photo : p),
        },
      },
      isDirty: true,
    }))
  }, [])

  // Form operations
  const reset = useCallback(() => {
    setState({
      formData: { ...DEFAULT_FORM_DATA, ...initialData },
      errors: {},
      isSubmitting: false,
      isDirty: false,
      isValid: false,
      submitError: null,
      submitSuccess: null,
    })
  }, [initialData])

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {}, submitError: null }))
  }, [])

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, submitSuccess: null }))
  }, [])

  const loadWorkshop = useCallback((workshop: NewWorkshop) => {
    setState(prev => ({
      ...prev,
      formData: {
        title: workshop.title,
        subtitle: workshop.subtitle || '',
        overview: workshop.overview,
        duration: workshop.duration,
        targetAudience: workshop.targetAudience,
        startDate: workshop.startDate instanceof Date ? workshop.startDate.toISOString().split('T')[0] : (typeof workshop.startDate === 'string' ? workshop.startDate : new Date(workshop.startDate).toISOString().split('T')[0]),
        endDate: workshop.endDate instanceof Date ? workshop.endDate.toISOString().split('T')[0] : (typeof workshop.endDate === 'string' ? workshop.endDate : new Date(workshop.endDate).toISOString().split('T')[0]),
        status: workshop.status,
        highlights: workshop.highlights,
        syllabus: workshop.syllabus,
        materials: workshop.materials,
        assessment: workshop.assessment,
        learningOutcomes: workshop.learningOutcomes,
        media: workshop.media,
        seo: workshop.seo,
        source: workshop.source,
      },
      isDirty: false,
      errors: {},
      submitError: null,
      submitSuccess: null,
    }))
  }, [])

  const submit = useCallback(async (): Promise<NewWorkshop | null> => {
    // Validate form
    if (!validate()) {
      setState(prev => ({ ...prev, submitError: 'Please fix all validation errors' }))
      return null
    }

    setState(prev => ({ ...prev, isSubmitting: true, submitError: null, submitSuccess: null }))

    try {
      // Generate slug from title
      const slug = state.formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const workshopData = {
        ...state.formData,
        slug,
        startDate: new Date(state.formData.startDate + 'T00:00:00'),
        endDate: new Date(state.formData.endDate + 'T00:00:00'),
      }

      const result = await workshopService.create({ workshop: workshopData })

      if (!result.success || !result.data) {
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_CREATE_FAILED)
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: WORKSHOP_SUCCESS_MESSAGES.WORKSHOP_CREATED,
        isDirty: false,
      }))

      return result.data
    } catch (error) {
      console.error('Error submitting workshop:', error)
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: error instanceof Error ? error.message : WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
      }))
      return null
    }
  }, [state.formData, validate])

  // Utility functions
  const hasFieldError = useCallback((field: keyof WorkshopFormData): boolean => {
    return !!state.errors[field]
  }, [state.errors])

  const getFieldError = useCallback((field: keyof WorkshopFormData): string | null => {
    return state.errors[field] || null
  }, [state.errors])

  // Auto-validate form when data changes
  useEffect(() => {
    validate()
  }, [state.formData, validate])

  // Return hook interface
  return {
    // State
    formData: state.formData,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    isValid: state.isValid,
    submitError: state.submitError,
    submitSuccess: state.submitSuccess,

    // Form field setters
    setField,
    setFields,

    // Array field operations
    addHighlight,
    removeHighlight,
    updateHighlight,
    addSyllabusDay,
    removeSyllabusDay,
    updateSyllabusDay,
    addMaterial,
    removeMaterial,
    updateMaterial,
    addAssessment,
    removeAssessment,
    updateAssessment,
    addLearningOutcome,
    removeLearningOutcome,
    updateLearningOutcome,
    addPhoto,
    removePhoto,
    updatePhoto,

    // Form operations
    reset,
    validate,
    validateField,
    validateFieldOnBlur,
    submit,
    loadWorkshop,

    // Utility functions
    clearErrors,
    clearSuccess,
    hasFieldError,
    getFieldError,
    getFieldRequirements,
  }
}

// Export default
export default useWorkshopForm