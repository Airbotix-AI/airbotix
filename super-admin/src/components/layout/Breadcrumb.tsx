import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { BREADCRUMB_CONFIG, PROTECTED_ROUTES } from '@/constants/routes'
import { cn } from '@/utils'

interface BreadcrumbProps {
  className?: string
}

export default function Breadcrumb({ className }: BreadcrumbProps) {
  const location = useLocation()
  
  const getBreadcrumbItems = () => {
    const path = location.pathname as keyof typeof BREADCRUMB_CONFIG
    const items = BREADCRUMB_CONFIG[path] || ['Dashboard']
    
    return items.map((item, index) => ({
      label: item,
      href: index === 0 ? PROTECTED_ROUTES.DASHBOARD : undefined,
      isLast: index === items.length - 1
    }))
  }

  const breadcrumbItems = getBreadcrumbItems()

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}>
      <Link
        to={PROTECTED_ROUTES.DASHBOARD}
        className="flex items-center hover:text-gray-700 transition-colors duration-200"
      >
        <Home className="h-4 w-4 mr-1" />
        Dashboard
      </Link>
      
      {breadcrumbItems.slice(1).map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.isLast ? (
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

// Export types for external use
export type { BreadcrumbProps }
