import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Students from '@/pages/Students'
import Teachers from '@/pages/Teachers'
import Workshops from '@/pages/Workshops'
import WorkshopForm from '@/pages/WorkshopForm'
import Courses from '@/pages/Courses'
import Content from '@/pages/Content'

import { PERMISSIONS } from '@/constants/permissions'


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="students"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_STUDENTS}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="teachers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_TEACHERS}>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="workshops"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_WORKSHOPS}>
                <Workshops />
              </ProtectedRoute>
            }
          />
                    <Route
            path="workshops/new"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_WORKSHOPS}>
                <WorkshopForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="workshops/:id/edit"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_WORKSHOPS}>
                <WorkshopForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_COURSES}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="content"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_CONTENT}>
                <Content />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App