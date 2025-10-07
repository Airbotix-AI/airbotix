// BasicInfo Component
// Handles basic workshop information input fields

import { useState, useEffect } from 'react'
import { WorkshopFormData } from '@/types/workshop'

interface BasicInfoProps {
  formData: WorkshopFormData
  setField: (field: keyof WorkshopFormData, value: any) => void
  hasFieldError: (field: keyof WorkshopFormData) => boolean
  getFieldError: (field: keyof WorkshopFormData) => string | null
  validateFieldOnBlur: (field: keyof WorkshopFormData) => void
}

export default function BasicInfo({
  formData,
  setField,
  hasFieldError,
  getFieldError,
  validateFieldOnBlur
}: BasicInfoProps) {
  // Duration state management
  const [durationValue, setDurationValue] = useState<number>(1)

  // Parse duration from formData and update local state
  useEffect(() => {
    if (formData.duration) {
      const match = formData.duration.match(/^(\d+)\s+day/)
      if (match) {
        setDurationValue(parseInt(match[1]))
      }
    }
  }, [formData.duration])

  // Update formData when duration value changes
  useEffect(() => {
    const durationString = `${durationValue} day`
    if (formData.duration !== durationString) {
      setField('duration', durationString)
    }
  }, [durationValue, setField, formData.duration])

  // Helper function to render form field
  function renderFormField(
    field: keyof WorkshopFormData,
    label: string,
    type: 'text' | 'textarea' | 'date' | 'select' = 'text',
    placeholder?: string,
    options?: { value: string; label: string }[],
    rows?: number
  ) {
    const isRequired = true // All fields are now required
    const fieldValue = formData[field] as any
    
    return (
      <div>
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {isRequired && '*'}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            id={field}
            rows={rows || 4}
            value={fieldValue || ''}
            onChange={(e) => setField(field, e.target.value)}
            onBlur={() => validateFieldOnBlur(field)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError(field) ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={placeholder}
            title={label}
          />
        ) : type === 'select' ? (
          <select
            id={field}
            value={fieldValue || ''}
            onChange={(e) => setField(field, e.target.value)}
            onBlur={() => validateFieldOnBlur(field)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError(field) ? 'border-red-300' : 'border-gray-300'
            }`}
            title={label}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={field}
            value={fieldValue || ''}
            onChange={(e) => setField(field, e.target.value)}
            onBlur={() => validateFieldOnBlur(field)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError(field) ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={placeholder}
            title={label}
          />
        )}
        
        {hasFieldError(field) && (
          <p className="mt-1 text-sm text-red-600">{getFieldError(field)}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderFormField('title', 'Workshop Title', 'text', 'Enter workshop title')}
      {renderFormField('subtitle', 'Subtitle', 'text', 'Enter workshop subtitle')}
      {renderFormField('overview', 'Overview', 'textarea', 'Enter detailed workshop overview')}
      {renderFormField('targetAudience', 'Target Audience', 'text', 'e.g., Grades 5-8, High School Students')}
      
      {/* Duration Field */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duration *
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="duration"
            min="1"
            value={durationValue}
            onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
            onBlur={() => validateFieldOnBlur('duration')}
            className={`w-20 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasFieldError('duration') ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="1"
            title="Duration value"
          />
          <span className="text-sm text-gray-600">day</span>
        </div>
        {hasFieldError('duration') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('duration')}</p>
        )}
      </div>
    </div>
  )
}