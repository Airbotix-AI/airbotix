import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <p className="mt-4 text-gray-500">The page you’re looking for doesn’t exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound


