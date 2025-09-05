import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  FileText, 
  Menu, 
  X, 
  LogOut,
  Settings,
  Plus,
  Upload,
  Download
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { APP_STRINGS } from '@/constants/strings'
import { ROUTE_PATHS, getBreadcrumbItems, getPageTitle } from '@/constants/routes'
import { Breadcrumb } from '../ui/Breadcrumb'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { MetaTags } from '../MetaTags'
import { cn } from '@/utils'

const navigation = [
  { 
    name: APP_STRINGS.NAV_DASHBOARD, 
    href: ROUTE_PATHS.DASHBOARD, 
    icon: LayoutDashboard,
    permission: 'VIEW_DASHBOARD'
  },
  { 
    name: APP_STRINGS.NAV_STUDENTS, 
    href: ROUTE_PATHS.STUDENTS, 
    icon: Users,
    permission: 'VIEW_STUDENTS',
    badge: { count: 0, variant: 'default' as const }
  },
  { 
    name: APP_STRINGS.NAV_TEACHERS, 
    href: ROUTE_PATHS.TEACHERS, 
    icon: GraduationCap,
    permission: 'VIEW_TEACHERS'
  },
  { 
    name: APP_STRINGS.NAV_WORKSHOPS, 
    href: ROUTE_PATHS.WORKSHOPS, 
    icon: Calendar,
    permission: 'VIEW_WORKSHOPS'
  },
  { 
    name: APP_STRINGS.NAV_COURSES, 
    href: ROUTE_PATHS.COURSES, 
    icon: BookOpen,
    permission: 'VIEW_COURSES'
  },
  { 
    name: APP_STRINGS.NAV_CONTENT, 
    href: ROUTE_PATHS.CONTENT, 
    icon: FileText,
    permission: 'VIEW_CONTENT'
  },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([])
  const location = useLocation()
  const { profile, signOut } = useAuth()

  // Update page title and breadcrumbs when location changes
  useEffect(() => {
    const title = getPageTitle(location.pathname)
    const breadcrumbs = getBreadcrumbItems(location.pathname)
    
    setPageTitle(title)
    setBreadcrumbItems(breadcrumbs)
    
    // Update document title
    document.title = `${title} - Airbotix Super Admin`
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Check if current path is a student route
  const isStudentRoute = location.pathname.startsWith('/admin/students')
  const isStudentsList = location.pathname === '/admin/students'

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{APP_STRINGS.APP_NAME}</h1>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== ROUTE_PATHS.DASHBOARD && location.pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-white" : "text-gray-500"
                      )}
                    />
                    {item.name}
                  </div>
                  
                  {/* Badge for student count */}
                  {item.badge && item.badge.count > 0 && (
                    <Badge 
                      variant={isActive ? "secondary" : item.badge.variant}
                      className={cn(
                        "text-xs",
                        isActive ? "bg-white/20 text-white" : ""
                      )}
                    >
                      {item.badge.count}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {profile?.full_name?.charAt(0).toUpperCase() || profile?.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title={APP_STRINGS.NAV_LOGOUT}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              
              {/* Breadcrumb Navigation */}
              <div className="hidden sm:block">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Actions for Student Routes */}
              {isStudentRoute && (
                <div className="flex items-center gap-2">
                  {isStudentsList && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={ROUTE_PATHS.STUDENTS_IMPORT}>
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={ROUTE_PATHS.STUDENTS_EXPORT}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    asChild
                  >
                    <Link to={ROUTE_PATHS.STUDENTS_NEW}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Link>
                  </Button>
                </div>
              )}
              
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
