// Form Progress Component
// Displays completion progress for workshop form sections

import { useMemo } from 'react'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'
import type { WorkshopFormData } from '@/types'

interface FormProgressProps {
  formData: WorkshopFormData
  errors: Record<string, string>
  compact?: boolean
}

interface SectionStatus {
  name: string
  key: string
  completed: boolean
  hasError: boolean
  fields: string[]
}

export function FormProgress({ formData, errors, compact = false }: FormProgressProps) {
  // Define form sections with their fields
  const sections: SectionStatus[] = useMemo(() => [
    {
      name: 'Basic Information',
      key: 'basic',
      fields: ['title', 'subtitle', 'overview', 'duration', 'targetAudience'],
      completed: false,
      hasError: false
    },
    {
      name: 'Time & Status',
      key: 'time',
      fields: ['startDate', 'endDate', 'status'],
      completed: false,
      hasError: false
    },
    {
      name: 'Content Modules',
      key: 'content',
      fields: ['highlights', 'syllabus', 'materials', 'assessment', 'learningOutcomes'],
      completed: false,
      hasError: false
    },
    {
      name: 'Media Assets',
      key: 'media',
      fields: ['media'],
      completed: false,
      hasError: false
    },
    {
      name: 'SEO Settings',
      key: 'seo',
      fields: ['seo', 'source'],
      completed: false,
      hasError: false
    }
  ], [])

  // Calculate section completion status
  const sectionsWithStatus = useMemo(() => {
    return sections.map(section => {
      let completed = true
      let hasError = false

      // Check each field in the section
      for (const field of section.fields) {
        const value = formData[field as keyof WorkshopFormData]
        
        // Check if field has error
        if (errors[field]) {
          hasError = true
          completed = false
          continue
        }

        // Check if field is completed
        if (value === null || value === undefined) {
          completed = false
          continue
        }

        // String field validation
        if (typeof value === 'string' && value.trim().length === 0) {
          completed = false
          continue
        }

        // Array field validation
        if (Array.isArray(value)) {
          if (value.length === 0) {
            completed = false
            continue
          }
          // Check for empty items in array
          const hasEmptyItems = value.some(item => 
            typeof item === 'string' && item.trim().length === 0
          )
          if (hasEmptyItems) {
            completed = false
            continue
          }
        }

        // Object field validation (materials, media, seo)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (field === 'materials') {
            const materials = value as any
            const categories = ['hardware', 'software', 'onlineResources']
            for (const category of categories) {
              if (!materials[category] || !Array.isArray(materials[category]) || materials[category].length === 0) {
                completed = false
                break
              }
              const hasEmptyItems = materials[category].some((item: string) => item.trim().length === 0)
              if (hasEmptyItems) {
                completed = false
                break
              }
            }
          } else if (field === 'media') {
            const media = value as any
            if (!media.video || !media.video.src || media.video.src.trim().length === 0) {
              completed = false
              continue
            }
            if (!media.photos || !Array.isArray(media.photos) || media.photos.length === 0) {
              completed = false
              continue
            }
            const hasEmptyPhotos = media.photos.some((photo: any) => !photo.src || photo.src.trim().length === 0)
            if (hasEmptyPhotos) {
              completed = false
              continue
            }
          } else if (field === 'seo') {
            const seo = value as any
            if (!seo.title || seo.title.trim().length === 0 || !seo.description || seo.description.trim().length === 0) {
              completed = false
              continue
            }
          }
        }
      }

      return {
        ...section,
        completed,
        hasError
      }
    })
  }, [sections, formData, errors])

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completedSections = sectionsWithStatus.filter(section => section.completed).length
    return Math.round((completedSections / sectionsWithStatus.length) * 100)
  }, [sectionsWithStatus])

  // Get progress color based on completion
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 80) return 'bg-blue-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Get section icon
  const getSectionIcon = (section: SectionStatus) => {
    if (section.hasError) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }
    if (section.completed) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <Circle className="w-4 h-4 text-gray-400" />
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Progress</h3>
            <span className="text-xs font-medium text-gray-600">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
              // eslint-disable-next-line react/forbid-dom-props
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Section Status - Compact */}
        <div className="space-y-2">
          {sectionsWithStatus.map((section) => (
            <div key={section.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getSectionIcon(section)}
                <span className={`text-xs font-medium ${
                  section.completed 
                    ? 'text-green-700' 
                    : section.hasError 
                      ? 'text-red-700' 
                      : 'text-gray-600'
                }`}>
                  {section.name}
                </span>
              </div>
              {section.hasError && (
                <span className="text-xs text-red-500">!</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Form Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {overallProgress}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
            // eslint-disable-next-line react/forbid-dom-props
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Section Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Section Status</h4>
        {sectionsWithStatus.map((section) => (
          <div key={section.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getSectionIcon(section)}
              <span className={`text-sm font-medium ${
                section.completed 
                  ? 'text-green-700' 
                  : section.hasError 
                    ? 'text-red-700' 
                    : 'text-gray-600'
              }`}>
                {section.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {section.hasError && (
                <span className="text-xs text-red-500 font-medium">Has Errors</span>
              )}
              {section.completed && !section.hasError && (
                <span className="text-xs text-green-500 font-medium">Complete</span>
              )}
              {!section.completed && !section.hasError && (
                <span className="text-xs text-gray-400 font-medium">Incomplete</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Tips */}
      {overallProgress < 100 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Complete all sections to enable form submission. 
            {overallProgress === 0 && ' Start by filling in the Basic Information section.'}
            {overallProgress > 0 && overallProgress < 100 && ' You\'re making great progress!'}
          </p>
        </div>
      )}

      {overallProgress === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            <strong>Excellent!</strong> All sections are complete. You can now save your workshop.
          </p>
        </div>
      )}
    </div>
  )
}

export default FormProgress