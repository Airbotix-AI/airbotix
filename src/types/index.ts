// Common types for the Airbotix website

export interface Workshop {
  id: string
  title: string
  description: string
  duration: string
  ageGroup: string
  maxParticipants: number
  price: number
  imageUrl?: string
  tags: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  isAvailable: boolean
}

export interface Instructor {
  id: string
  name: string
  bio: string
  expertise: string[]
  imageUrl?: string
  linkedInUrl?: string
}

export interface Testimonial {
  id: string
  studentName: string
  parentName?: string
  content: string
  rating: number
  workshopTitle: string
  date: string
  imageUrl?: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  message: string
  workshopInterest?: string
  preferredContactMethod: 'email' | 'phone'
}

export interface BookingRequest {
  workshopId: string
  studentName: string
  studentAge: number
  parentName: string
  parentEmail: string
  parentPhone: string
  specialRequirements?: string
  emergencyContact: string
  emergencyPhone: string
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  title: string
  description?: string
  workshopId?: string
  date: string
  tags: string[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
  children?: NavItem[]
}

// Theme types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: Record<string, string>
}