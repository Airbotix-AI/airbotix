// Workshop Form Page
// Comprehensive form for creating and editing workshops with 5 main sections

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Calendar,
  FileText,
  Image,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useWorkshopForm } from '@/hooks'
import { workshopService } from '@/services'
import { WORKSHOP_STATUS_LABELS } from '@/constants/workshop'
import { BasicInfo, ContentModules, MediaAssets, SEOSettings, FormProgress } from '@/components/workshop'

export default function WorkshopForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
  
  const {
    formData,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    submitError,
    submitSuccess,
    setField,
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
    submit,
    loadWorkshop,
    hasFieldError,
    getFieldError,
    validateFieldOnBlur
  } = useWorkshopForm()

  const [activeSection, setActiveSection] = useState<string>('basic')
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false)
  const [isStatusCollapsed, setIsStatusCollapsed] = useState(false)

  // Load workshop data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchWorkshop = async () => {
        const result = await workshopService.getById(id)
        if (result.success && result.data) {
          loadWorkshop(result.data)
        }
      }
      fetchWorkshop()
    }
  }, [isEditing, id, loadWorkshop])

  // Handle form submission
  const handleSubmit = async () => {
    const result = await submit()
    if (result) {
      navigate('/admin/workshops')
    }
  }

  // Handle preview
  const handlePreview = () => {
    // TODO: Implement preview functionality
    alert('Preview functionality will be implemented soon!')
  }

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/admin/workshops')
      }
    } else {
      navigate('/admin/workshops')
    }
  }

  // Section configuration
  const sections = [
    { id: 'basic', label: 'Basic Information', icon: FileText },
    { id: 'time', label: 'Time & Status', icon: Calendar },
    { id: 'content', label: 'Content Modules', icon: FileText },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'seo', label: 'SEO Settings', icon: Search }
  ]

  // Get section description
  const getSectionDescription = (sectionId: string): string => {
    const descriptions: Record<string, string> = {
      basic: 'Enter the basic information about the workshop',
      time: 'Set the workshop schedule and status',
      content: 'Define the workshop content, materials, and learning outcomes',
      media: 'Upload and manage workshop media assets',
      seo: 'Configure SEO settings for better discoverability'
    }
    return descriptions[sectionId] || ''
  }

  // Helper function to render form field
  function renderFormField(
    field: keyof typeof formData,
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

  // Render section content based on active section
  function renderSectionContent(sectionId: string) {
    switch (sectionId) {
      case 'basic':
        return (
          <BasicInfo
            formData={formData}
            setField={setField}
            hasFieldError={hasFieldError}
            getFieldError={getFieldError}
            validateFieldOnBlur={validateFieldOnBlur}
          />
        )
      case 'time':
        return renderTimeStatusSection()
      case 'content':
        return (
          <ContentModules
            formData={formData}
            hasFieldError={hasFieldError}
            getFieldError={getFieldError}
            addHighlight={addHighlight}
            removeHighlight={removeHighlight}
            updateHighlight={updateHighlight}
            addSyllabusDay={addSyllabusDay}
            removeSyllabusDay={removeSyllabusDay}
            updateSyllabusDay={updateSyllabusDay}
            addMaterial={addMaterial}
            removeMaterial={removeMaterial}
            updateMaterial={updateMaterial}
            addAssessment={addAssessment}
            removeAssessment={removeAssessment}
            updateAssessment={updateAssessment}
            addLearningOutcome={addLearningOutcome}
            removeLearningOutcome={removeLearningOutcome}
            updateLearningOutcome={updateLearningOutcome}
          />
        )
      case 'media':
        return (
          <MediaAssets
            formData={formData}
            setField={setField}
            hasFieldError={hasFieldError}
            getFieldError={getFieldError}
            addPhoto={addPhoto}
            removePhoto={removePhoto}
            updatePhoto={updatePhoto}
          />
        )
      case 'seo':
        return (
          <SEOSettings
            formData={formData}
            setField={setField}
            hasFieldError={hasFieldError}
            getFieldError={getFieldError}
            validateFieldOnBlur={validateFieldOnBlur}
          />
        )
      default:
        return null
    }
  }

  // Time & Status Section
  function renderTimeStatusSection() {
    const statusOptions = Object.entries(WORKSHOP_STATUS_LABELS).map(([value, label]) => ({
      value,
      label
    }))

    return (
      <div className="space-y-6">
        {renderFormField('startDate', 'Start Date', 'date')}
        {renderFormField('endDate', 'End Date', 'date')}
        {renderFormField('status', 'Status', 'select', undefined, statusOptions)}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                title="Back to workshops"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Workshop' : 'Create New Workshop'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Preview workshop"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save workshop"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Form Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      title={section.label}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {section.label}
                    </button>
                  )
                })}
              </nav>

              {/* Form Progress */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Progress</h3>
                  <button
                    onClick={() => setIsProgressCollapsed(!isProgressCollapsed)}
                    className="lg:hidden flex items-center text-gray-500 hover:text-gray-700"
                    title={isProgressCollapsed ? 'Expand progress' : 'Collapse progress'}
                  >
                    {isProgressCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {!isProgressCollapsed && (
                  <FormProgress formData={formData} errors={errors} compact={true} />
                )}
              </div>

              {/* Form Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Form Status</h3>
                  <button
                    onClick={() => setIsStatusCollapsed(!isStatusCollapsed)}
                    className="lg:hidden flex items-center text-gray-500 hover:text-gray-700"
                    title={isStatusCollapsed ? 'Expand status' : 'Collapse status'}
                  >
                    {isStatusCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {!isStatusCollapsed && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      {isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={isValid ? 'text-green-700' : 'text-red-700'}>
                        {isValid ? 'All fields valid' : 'Validation errors'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      {isDirty ? (
                        <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className={isDirty ? 'text-yellow-700' : 'text-gray-600'}>
                        {isDirty ? 'Unsaved changes' : 'No changes'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {getSectionDescription(activeSection)}
                </p>
              </div>

              {/* Form Content */}
              <div className="px-6 py-6">
                {renderSectionContent(activeSection)}
              </div>
            </div>

            {/* Error/Success Messages */}
            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <p className="text-sm text-green-700 mt-1">{submitSuccess}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}