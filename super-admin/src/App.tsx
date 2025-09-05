import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import StudentsPage from '@/pages/StudentsPage'
import StudentNewPage from '@/pages/students/StudentNewPage'
import StudentDetailsPage from '@/pages/students/StudentDetailsPage'
import StudentEditPage from '@/pages/students/StudentEditPage'
import Teachers from '@/pages/Teachers'
import Workshops from '@/pages/Workshops'
import Courses from '@/pages/Courses'
import Content from '@/pages/Content'
import Error404Page from '@/pages/Error404Page'
import Error401Page from '@/pages/Error401Page'

import { PERMISSIONS } from '@/constants/permissions'
import { ROUTE_PATHS } from '@/constants/routes'


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route
          path={ROUTE_PATHS.ADMIN}
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Student Management Routes */}
          <Route
            path="students"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/new"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_STUDENTS}>
                <StudentNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/:id"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
                <StudentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/:id/edit"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.UPDATE_STUDENTS}>
                <StudentEditPage />
              </ProtectedRoute>
            }
          />
          
          {/* Teacher Management Routes */}
          <Route
            path="teachers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_TEACHERS}>
                <Teachers />
              </ProtectedRoute>
            }
          />
          
          {/* Workshop Management Routes */}
          <Route
            path="workshops"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_WORKSHOPS}>
                <Workshops />
              </ProtectedRoute>
            }
          />
          
          {/* Course Management Routes */}
          <Route
            path="courses"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_COURSES}>
                <Courses />
              </ProtectedRoute>
            }
          />
          
          {/* Content Management Routes */}
          <Route
            path="content"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_CONTENT}>
                <Content />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Error Routes */}
        <Route path={ROUTE_PATHS.UNAUTHORIZED} element={<Error401Page />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </AuthProvider>
  )
}

export default App