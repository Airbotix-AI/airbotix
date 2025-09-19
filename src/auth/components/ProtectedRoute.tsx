import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = ROUTES.LOGIN,
}) => {
  const location = useLocation();
  const { isAuthenticated, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setIsInitialized(true);
    };

    initAuth();
  }, [initialize]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on authentication requirements
  if (requireAuth && !isAuthenticated) {
    // Save intended destination
    const from = location.pathname + location.search;
    return <Navigate to={redirectTo} state={{ from }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // User is authenticated but trying to access public-only route (like login)
    const from = (location.state as any)?.from;
    return <Navigate to={from || ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;