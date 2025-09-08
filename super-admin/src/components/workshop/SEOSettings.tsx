// SEOSettings Component
// Handles SEO settings for workshops

import { WorkshopFormData } from '@/types/workshop'

interface SEOSettingsProps {
  formData: WorkshopFormData
  setField: (field: keyof WorkshopFormData, value: any) => void
  hasFieldError: (field: keyof WorkshopFormData) => boolean
  getFieldError: (field: keyof WorkshopFormData) => string | null
  validateFieldOnBlur: (field: keyof WorkshopFormData) => void
}

export default function SEOSettings({
  formData,
  setField,
  hasFieldError,
  getFieldError,
  validateFieldOnBlur
}: SEOSettingsProps) {
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
      {/* SEO Title */}
      <div>
        <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
          SEO Title *
        </label>
        <input
          type="text"
          id="seoTitle"
          value={formData.seo.title}
          onChange={(e) => setField('seo', { ...formData.seo, title: e.target.value })}
          onBlur={() => validateFieldOnBlur('seo')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('seo') ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="SEO-optimized title for search engines"
          title="SEO title is required"
        />
        {hasFieldError('seo') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('seo')}</p>
        )}
      </div>

      {/* SEO Description */}
      <div>
        <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
          SEO Description *
        </label>
        <textarea
          id="seoDescription"
          rows={4}
          value={formData.seo.description}
          onChange={(e) => setField('seo', { ...formData.seo, description: e.target.value })}
          onBlur={() => validateFieldOnBlur('seo')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('seo') ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="SEO-optimized description for search engines"
          title="SEO description is required"
        />
        {hasFieldError('seo') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('seo')}</p>
        )}
      </div>

      {/* Source */}
      {renderFormField('source', 'Source', 'text', 'e.g., Airbotix Curriculum Team, External Partner')}
    </div>
  )
}