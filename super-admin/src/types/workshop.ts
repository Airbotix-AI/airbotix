// Workshop Management Types
// Based on PRD requirements - all fields are required

// Workshop Status Types
export type WorkshopStatus = 'draft' | 'completed' | 'archived'

// Syllabus Day Structure
export interface SyllabusDay {
  day: number
  title: string
  objective: string
  activities: string[]
}

// Materials Structure
export interface WorkshopMaterials {
  hardware: string[] // Required - minimum 1 item
  software: string[] // Required - minimum 1 item
  onlineResources: string[] // Required - minimum 1 item
}

// Assessment Structure
export interface AssessmentItem {
  item: string
  weight: string
  criteria?: string
}

// Media Video Structure
export interface WorkshopVideo {
  src: string
  poster?: string
  caption?: string
}

// Media Photo Structure
export interface WorkshopPhoto {
  src: string
  alt?: string
}

// Media Assets Structure
export interface WorkshopMedia {
  video: WorkshopVideo // Required - minimum 1 video
  photos: WorkshopPhoto[] // Required - minimum 1 photo
}

// SEO Settings Structure
export interface WorkshopSEO {
  title: string // Required
  description: string // Required
}

// Main Workshop Interface
export interface Workshop {
  // Basic Information (All Required)
  id: string
  slug: string
  title: string
  subtitle?: string
  overview: string
  duration: string
  targetAudience: string

  // Time & Status (All Required)
  startDate: Date
  endDate: Date
  status: WorkshopStatus

  // Content Modules (All Required with minimum items)
  highlights: string[] // Required - minimum 1 item
  syllabus: SyllabusDay[] // Required - minimum 1 day
  materials: WorkshopMaterials // Required - each category minimum 1 item
  assessment: AssessmentItem[] // Required - minimum 1 item
  learningOutcomes: string[] // Required - minimum 1 item

  // Media Assets (All Required)
  media: WorkshopMedia // Required - minimum 1 video and 1 photo

  // SEO Settings (All Required)
  seo: WorkshopSEO // Required - title and description

  // Source (Required)
  source: string // Required for tracking workshop origin

  // Metadata
  createdAt: Date
  updatedAt: Date
}

// Workshop Creation/Update Types
export interface CreateWorkshopRequest {
  workshop: Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>
}

export interface UpdateWorkshopRequest {
  workshop: Partial<Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>>
}

// Workshop API Response Types
export interface WorkshopResponse {
  workshop: Workshop
}

export interface WorkshopsResponse {
  workshops: Workshop[]
  total: number
  page: number
  limit: number
}

// Workshop Filtering and Search
export interface WorkshopFilters {
  status?: WorkshopStatus
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: 'title' | 'startDate' | 'endDate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Workshop Form State Types
export interface WorkshopFormData {
  // Basic Information
  title: string
  subtitle: string
  overview: string
  duration: string
  targetAudience: string

  // Time & Status
  startDate: string
  endDate: string
  status: WorkshopStatus

  // Content Modules
  highlights: string[]
  syllabus: SyllabusDay[]
  materials: WorkshopMaterials
  assessment: AssessmentItem[]
  learningOutcomes: string[]

  // Media Assets
  media: WorkshopMedia

  // SEO Settings
  seo: WorkshopSEO

  // Source
  source: string
}

// Workshop Form Validation Types
export interface WorkshopFormErrors {
  title?: string
  overview?: string
  duration?: string
  targetAudience?: string
  startDate?: string
  endDate?: string
  status?: string
  highlights?: string
  syllabus?: string
  materials?: string
  assessment?: string
  learningOutcomes?: string
  media?: string
  seo?: string
  source?: string
}

// Workshop Form State
export interface WorkshopFormState {
  data: WorkshopFormData
  errors: WorkshopFormErrors
  touched: Partial<Record<keyof WorkshopFormData, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// Workshop List Item (for table/card display)
export interface WorkshopListItem {
  id: string
  title: string
  status: WorkshopStatus
  startDate: Date
  endDate: Date
  targetAudience: string
  duration: string
  createdAt: Date
  updatedAt: Date
}

// Workshop Preview Props
export interface WorkshopPreviewProps {
  workshop: Workshop
  isPreview?: boolean
}

// Workshop Card Props
export interface WorkshopCardProps {
  workshop: WorkshopListItem
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onArchive?: (id: string) => void
  onPreview?: (id: string) => void
}

// Workshop Form Section Props
export interface WorkshopFormSectionProps {
  data: WorkshopFormData
  errors: WorkshopFormErrors
  onChange: (field: keyof WorkshopFormData, value: any) => void
  onBlur?: (field: keyof WorkshopFormData) => void
}

// Workshop Validation Rules
export interface WorkshopValidationRules {
  title: { required: boolean; minLength: number; maxLength: number }
  overview: { required: boolean; minLength: number; maxLength: number }
  duration: { required: boolean; minLength: number; maxLength: number }
  targetAudience: { required: boolean; minLength: number; maxLength: number }
  startDate: { required: boolean; type: 'date' }
  endDate: { required: boolean; type: 'date'; after: 'startDate' }
  status: { required: boolean; enum: WorkshopStatus[] }
  highlights: { required: boolean; minItems: number; maxItems: number }
  syllabus: { required: boolean; minItems: number; maxItems: number }
  materials: {
    hardware: { required: boolean; minItems: number; maxItems: number }
    software: { required: boolean; minItems: number; maxItems: number }
    onlineResources: { required: boolean; minItems: number; maxItems: number }
  }
  assessment: { required: boolean; minItems: number; maxItems: number }
  learningOutcomes: { required: boolean; minItems: number; maxItems: number }
  media: {
    video: { required: boolean; type: 'object' }
    photos: { required: boolean; minItems: number; maxItems: number }
  }
  seo: {
    title: { required: boolean; minLength: number; maxLength: number }
    description: { required: boolean; minLength: number; maxLength: number }
  }
  source: { required: boolean; minLength: number; maxLength: number }
}

// All types are already exported above with their definitions
