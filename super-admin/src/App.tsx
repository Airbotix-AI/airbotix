import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleGuard, TeacherAccess, StudentManagement, StudentCreation } from '@/components/auth/RoleGuard'
import AdminLayout from '@/components/layout/AdminLayout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ROUTES } from '@/constants/routes.constants'
import { USER_ROLES } from '@/constants/userRoles'
import { PERMISSIONS } from '@/constants/permissions'

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

// Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))
const AuthCallback = lazy(() => import('@/pages/AuthCallback'))
const Students = lazy(() => import('@/pages/Students'))
const Teachers = lazy(() => import('@/pages/Teachers'))
const Workshops = lazy(() => import('@/pages/Workshops'))
const Courses = lazy(() => import('@/pages/Courses'))
const Content = lazy(() => import('@/pages/Content'))

// Future student sub-pages (placeholders for now)
const AddStudent = lazy(() => import('@/pages/Students').then(() => ({ default: Students })))
const StudentDetails = lazy(() => import('@/pages/Students').then(() => ({ default: Students })))
const EditStudent = lazy(() => import('@/pages/Students').then(() => ({ default: Students })))

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner className="mx-auto mb-4" />
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
)

const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <LoadingSpinner className="mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// ============================================================================
// NOT FOUND COMPONENT
// ============================================================================

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Navigate to={ROUTES.DASHBOARD} replace />
    </div>
  </div>
)

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path="/admin/auth/callback" element={<AuthCallback />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route 
              path="dashboard" 
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Dashboard />
                </Suspense>
              } 
            />
            
            {/* Student Management Routes */}
            <Route 
              path="students" 
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
                  <StudentManagement>
                    <Outlet />
                  </StudentManagement>
                </ProtectedRoute>
              }
            >
              <Route 
                index 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Students />
                  </Suspense>
                } 
              />
              <Route 
                path="new" 
                element={
                  <StudentCreation>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <AddStudent />
                    </Suspense>
                  </StudentCreation>
                } 
              />
              <Route 
                path=":id" 
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <StudentDetails />
                  </Suspense>
                } 
              />
              <Route 
                path=":id/edit" 
                element={
                  <StudentCreation>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <EditStudent />
                    </Suspense>
                  </StudentCreation>
                } 
              />
            </Route>
            
            {/* Teacher Management Routes */}
            <Route
              path="teachers"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_TEACHERS}>
                  <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Teachers />
                    </Suspense>
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            
            {/* Workshop Management Routes */}
            <Route
              path="workshops"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_WORKSHOPS}>
                  <TeacherAccess>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Workshops />
                    </Suspense>
                  </TeacherAccess>
                </ProtectedRoute>
              }
            />
            
            {/* Course Management Routes */}
            <Route
              path="courses"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_COURSES}>
                  <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Courses />
                    </Suspense>
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            
            {/* Content Management Routes */}
            <Route
              path="content"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_CONTENT}>
                  <TeacherAccess>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Content />
                    </Suspense>
                  </TeacherAccess>
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Fallback Routes */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App