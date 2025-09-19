import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import Breadcrumb from './Breadcrumb'

interface AdminLayoutProps {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Navigation only */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-72
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar />
        </div>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header with user info */}
          <AdminHeader onSidebarToggle={toggleSidebar} />
          
          {/* Breadcrumb Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb />
          </div>
          
          {/* Page content */}
          <main className="flex-1">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  )
}

// Export types for external use
export type { AdminLayoutProps }
