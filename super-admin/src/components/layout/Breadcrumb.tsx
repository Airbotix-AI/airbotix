import React, { useMemo } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { 
  BREADCRUMB_CONFIG, 
  ROUTES, 
  ROUTE_LABELS
} from '@/constants/routes.constants'
import { cn } from '@/utils'

interface BreadcrumbProps {
  className?: string
  customLabels?: Record<string, string>
}

interface BreadcrumbItem {
  label: string
  href?: string
  isLast: boolean
  isClickable: boolean
}

export default function Breadcrumb({ className, customLabels = {} }: BreadcrumbProps) {
  const location = useLocation()
  const params = useParams()
  
  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname
    
    // Handle exact matches first
    if (BREADCRUMB_CONFIG[pathname]) {
      return BREADCRUMB_CONFIG[pathname].map((label, index, array) => ({
        label: customLabels[label] || label,
        href: index === 0 ? ROUTES.DASHBOARD : getRouteForBreadcrumb(label, index),
        isLast: index === array.length - 1,
        isClickable: index < array.length - 1
      }))
    }
    
    // Handle dynamic routes
    return generateDynamicBreadcrumbs(pathname, params, customLabels)
  }, [location.pathname, params, customLabels])
  
  // Don't show breadcrumb for dashboard or single-level pages
  if (breadcrumbItems.length <= 1 || location.pathname === ROUTES.DASHBOARD) {
    return null
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}>
      <Link
        to={ROUTES.DASHBOARD}
        className="flex items-center hover:text-gray-700 transition-colors duration-200"
      >
        <Home className="h-4 w-4 mr-1" />
        Dashboard
      </Link>
      
      {breadcrumbItems.slice(1).map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.isLast || !item.isClickable ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.href || '#'}
              className="hover:text-gray-700 transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate breadcrumbs for dynamic routes
 */
function generateDynamicBreadcrumbs(
  pathname: string, 
  params: Record<string, string | undefined>,
  customLabels: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`
    
    // Skip 'admin' segment
    if (segment === 'admin') continue
    
    let label = segment
    let href = currentPath
    
    // Handle dynamic segments
    if (segment.match(/^[a-f0-9-]{36}$/) || !isNaN(Number(segment))) {
      // This looks like an ID, try to get a meaningful label
      label = getDynamicLabel(pathname, segment, params, customLabels)
      href = currentPath
    } else {
      // Static segment, capitalize and format
      label = formatLabel(segment)
    }
    
    // Check for route template matches
    const routeTemplate = findMatchingRouteTemplate(currentPath, params)
    if (routeTemplate && ROUTE_LABELS[routeTemplate as keyof typeof ROUTE_LABELS]) {
      label = ROUTE_LABELS[routeTemplate as keyof typeof ROUTE_LABELS]
    }
    
    // Apply custom labels
    if (customLabels[label]) {
      label = customLabels[label]
    }
    
    breadcrumbs.push({
      label,
      href,
      isLast: i === segments.length - 1,
      isClickable: i < segments.length - 1
    })
  }
  
  return breadcrumbs
}

/**
 * Get label for dynamic route segments (IDs)
 */
function getDynamicLabel(
  pathname: string, 
  segment: string, 
  params: Record<string, string | undefined>,
  customLabels: Record<string, string>
): string {
  // Try to get custom label first
  if (customLabels[segment]) {
    return customLabels[segment]
  }
  
  // Default labels based on route context
  if (pathname.includes('/students/')) {
    return params.id ? `Student ${params.id.slice(0, 8)}...` : 'Student Details'
  }
  
  if (pathname.includes('/workshops/')) {
    return params.id ? `Workshop ${params.id.slice(0, 8)}...` : 'Workshop Details'
  }
  
  if (pathname.includes('/courses/')) {
    return params.id ? `Course ${params.id.slice(0, 8)}...` : 'Course Details'
  }
  
  if (pathname.includes('/teachers/')) {
    return params.id ? `Teacher ${params.id.slice(0, 8)}...` : 'Teacher Details'
  }
  
  return segment
}

/**
 * Format static labels
 */
function formatLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Find matching route template for dynamic routes
 */
function findMatchingRouteTemplate(
  currentPath: string, 
  params: Record<string, string | undefined>
): string | null {
  // Replace dynamic segments with template placeholders
  let template = currentPath
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      template = template.replace(`/${value}`, `/:${key}`)
    }
  })
  
  // Check if this template exists in our route labels
  if (ROUTE_LABELS[template as keyof typeof ROUTE_LABELS]) {
    return template
  }
  
  return null
}

/**
 * Get appropriate route for breadcrumb navigation
 */
function getRouteForBreadcrumb(label: string, index: number): string | undefined {
  if (index === 0) return ROUTES.DASHBOARD
  
  // Map labels to routes
  const labelRouteMap: Record<string, string> = {
    'Students': ROUTES.STUDENTS.INDEX,
    'Workshops': ROUTES.WORKSHOPS.INDEX,
    'Courses': ROUTES.COURSES.INDEX,
    'Teachers': ROUTES.TEACHERS.INDEX,
    'Content': ROUTES.CONTENT.INDEX
  }
  
  return labelRouteMap[label]
}

// ============================================================================
// HOOK FOR CUSTOM BREADCRUMB LABELS
// ============================================================================

/**
 * Hook to provide dynamic breadcrumb labels
 */
export function useBreadcrumbLabels() {
  // This could be enhanced to fetch actual entity names
  // For now, return empty object to use default behavior
  return {}
}

// Export types for external use
export type { BreadcrumbProps, BreadcrumbItem }
