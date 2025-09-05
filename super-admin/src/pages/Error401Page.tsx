/**
 * 401 Unauthorized Page
 * Access denied error handling
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ROUTE_PATHS } from '../constants/routes';

export default function Error401Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">401</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild>
            <Link to={ROUTE_PATHS.DASHBOARD}>
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <div>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
