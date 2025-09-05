import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText 
} from 'lucide-react'

const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', href: '/students', icon: Users },
  { id: 'teachers', label: 'Teachers', href: '/teachers', icon: GraduationCap },
  { id: 'workshops', label: 'Workshops', href: '/workshops', icon: Calendar },
  { id: 'courses', label: 'Courses', href: '/courses', icon: BookOpen },
  { id: 'content', label: 'Content Management', href: '/content', icon: FileText }
] as const

interface AdminSidebarProps {
  className?: string
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const location = useLocation()

  return (
    <aside className={`w-72 bg-white border-r border-gray-200 h-full flex flex-col ${className || ''}`}>
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Airbotix Admin</h1>
      </div>

      {/* Navigation - PURE navigation, NO user info */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom space - NO user info, keep it clean */}
      <div className="p-4">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
