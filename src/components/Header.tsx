import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LOGO_PATHS, ALT_TEXTS, LOGO_SIZES } from '../constants/assets'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={LOGO_PATHS.BLACK_HORIZONTAL} 
                alt={ALT_TEXTS.LOGO_MAIN}
                className={`${LOGO_SIZES.HEADER.HEIGHT} ${LOGO_SIZES.HEADER.WIDTH} ${LOGO_SIZES.HEADER.MAX_WIDTH}`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/workshops" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Workshops
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link to="/book" className="btn-primary">
              Book Workshop
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link to="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link to="/workshops" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                Workshops
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                About
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                Contact
              </Link>
              <div className="pt-2">
                <Link to="/book" className="btn-primary w-full">
                  Book Workshop
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header