import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar,
  BookOpen,
  FileText
} from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext'
import { useStudentsList } from '../../hooks/useStudents'
import { ROUTES, hasRouteAccess } from '../../constants/routes.constants'
import { USER_ROLES } from '../../constants/userRoles'
import { cn } from '../../utils'
import type { UserRole } from '../../types/student.types'

interface NavigationItem {
  route: string
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  current?: boolean
  badge?: string | number
  allowedRoles?: UserRole[]
}

export default function AdminSidebar() {
  const location = useLocation()
  const { profile } = useAuth()
  const userRole = (profile?.role || 'teacher') as UserRole

  // Get student count for badge
  const { totalCount: studentCount } = useStudentsList()

  // Generate navigation items based on user role
  const navigationItems = useMemo(() => {
    const baseItems: NavigationItem[] = [
      {
        route: ROUTES.DASHBOARD,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
      },
      {
        route: ROUTES.STUDENTS.INDEX,
        title: 'Students',
        icon: Users,
        badge: studentCount,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
      },
      {
        route: ROUTES.TEACHERS.INDEX,
        title: 'Teachers',
        icon: GraduationCap,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
      },
      {
        route: ROUTES.WORKSHOPS.INDEX,
        title: 'Workshops',
        icon: Calendar,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
      },
      {
        route: ROUTES.COURSES.INDEX,
        title: 'Courses',
        icon: BookOpen,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
      },
      {
        route: ROUTES.CONTENT.INDEX,
        title: 'Content',
        icon: FileText,
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
      }
    ]

    // Filter items based on user role
    return baseItems.filter(item => 
      !item.allowedRoles || hasRouteAccess(item.route, userRole)
    )
  }, [userRole, studentCount])


  const isRouteActive = (route: string): boolean => {
    if (route === ROUTES.DASHBOARD) {
      return location.pathname === route
    }
    return location.pathname === route || location.pathname.startsWith(route + '/')
  }


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Super Admin
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = isRouteActive(item.route)
          
          return (
            <Link
              key={item.route}
              to={item.route}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                'hover:bg-gray-50 hover:scale-[1.02]',
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                  isActive 
                    ? 'text-primary' 
                    : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              <span className="flex-1">{item.title}</span>
              
              {/* Badge for item count */}
              {item.badge && (
                <span className={cn(
                  'ml-2 px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}