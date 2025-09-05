import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Menu, X, Search, LayoutDashboard, Users, GraduationCap, Calendar, BookOpen, FileText } from 'lucide-react'
import ErrorBoundary from '@/components/ErrorBoundary'

const LAYOUT_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024
} as const

const SIDEBAR_STATES = {
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
  OVERLAY: 'overlay'
} as const

interface MobileOptimizedLayoutProps {
  children?: React.ReactNode
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">
              Airbotix Admin
            </h1>
            
            {/* Simple search icon for mobile */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-screen lg:h-auto">
          {/* Sidebar */}
          <aside 
            className={`
              fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-72
              bg-white border-r border-gray-200
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <SimplifiedSidebar onClose={() => setIsSidebarOpen(false)} />
          </aside>

          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 lg:ml-0 min-h-screen">
            {/* Desktop Search Bar */}
            <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students, teachers, workshops..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-4 lg:p-6">
              <ErrorBoundary>
                {children || <Outlet />}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

// Simplified Sidebar Component  
const SimplifiedSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Airbotix Admin
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavigationItems />
      </nav>

      {/* Bottom space - NO user info, keep it clean */}
      <div className="p-4">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </div>
  )
}


// Navigation Items Component
const NavigationItems: React.FC = () => {
  const location = useLocation()
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', href: '/students', icon: Users },
    { id: 'teachers', label: 'Teachers', href: '/teachers', icon: GraduationCap },
    { id: 'workshops', label: 'Workshops', href: '/workshops', icon: Calendar },
    { id: 'courses', label: 'Courses', href: '/courses', icon: BookOpen },
    { id: 'content', label: 'Content Management', href: '/content', icon: FileText }
  ]

  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.href
        
        return (
          <Link
            key={item.id}
            to={item.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
            {isActive && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
            )}
          </Link>
        )
      })}
    </>
  )
}

export { MobileOptimizedLayout }
export default MobileOptimizedLayout
