import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ALT_TEXTS, LOGO_SIZES, RESPONSIVE_LOGOS } from '../constants/assets'
import { useAuthStore } from '@/store/authStore'
import LanguageToggle from '@/auth/components/LanguageToggle'
import { trackEvent } from '@/utils/analytics'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  const handleNavClick = (item: string, to: string) => {
    trackEvent('nav_click', { item, to_path: to })
  }

  const handleCtaClick = (name: string, to: string) => {
    trackEvent('cta_click', { cta_name: name, to_path: to })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={() => handleNavClick('home_logo', '/') }>
              {/* Mobile Logo - Vertical */}
              <img 
                src={RESPONSIVE_LOGOS.HEADER.MOBILE} 
                alt={ALT_TEXTS.LOGO_MAIN}
                className={`${LOGO_SIZES.HEADER.HEIGHT} ${LOGO_SIZES.HEADER.WIDTH} ${LOGO_SIZES.HEADER.MAX_WIDTH} block md:hidden`}
              />
              {/* Desktop Logo - Horizontal */}
              <img 
                src={RESPONSIVE_LOGOS.HEADER.DESKTOP} 
                alt={ALT_TEXTS.LOGO_MAIN}
                className={`${LOGO_SIZES.HEADER.HEIGHT} ${LOGO_SIZES.HEADER.WIDTH} ${LOGO_SIZES.HEADER.MAX_WIDTH} hidden md:block`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('home', '/') }>
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/workshops" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('workshops', '/workshops') }>
              {t('nav.workshops', 'Workshops')}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('blog', '/blog') }>
              {t('nav.blog', 'Blog')}
            </Link>
            <Link to="/media" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('media', '/media') }>
              {t('nav.media', 'Media')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('about', '/about') }>
              {t('nav.about', 'About')}
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('faq', '/faq') }>
              {t('nav.faq', 'FAQ')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('contact', '/contact') }>
              {t('nav.contact', 'Contact')}
            </Link>
          </nav>

          {/* Right Section - Language Toggle, Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.email}
                </span>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('dashboard', '/dashboard') }>
                  {t('nav.dashboard', 'Dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => handleNavClick('login', '/login') }>
                  {t('nav.login', 'Login')}
                </Link>
                <Link to="/book" className="btn-primary" onClick={() => handleCtaClick('book_workshop', '/book') }>
                  {t('nav.bookWorkshop', 'Book Workshop')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button and language toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label={isMenuOpen ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
              title={isMenuOpen ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
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
              <Link
                to="/"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('home', '/') }}
              >
                {t('nav.home', 'Home')}
              </Link>
              <Link
                to="/workshops"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('workshops', '/workshops') }}
              >
                {t('nav.workshops', 'Workshops')}
              </Link>
              <Link
                to="/blog"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('blog', '/blog') }}
              >
                {t('nav.blog', 'Blog')}
              </Link>
              <Link
                to="/media"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('media', '/media') }}
              >
                {t('nav.media', 'Media')}
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('about', '/about') }}
              >
                {t('nav.about', 'About')}
              </Link>
              <Link
                to="/faq"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('faq', '/faq') }}
              >
                {t('nav.faq', 'FAQ')}
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => { setIsMenuOpen(false); handleNavClick('contact', '/contact') }}
              >
                {t('nav.contact', 'Contact')}
              </Link>

              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    {user?.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => { setIsMenuOpen(false); handleNavClick('dashboard', '/dashboard') }}
                  >
                    {t('nav.dashboard', 'Dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t('nav.logout', 'Logout')}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => { setIsMenuOpen(false); handleNavClick('login', '/login') }}
                  >
                    {t('nav.login', 'Login')}
                  </Link>
                  <Link
                    to="/book"
                    className="btn-primary w-full"
                    onClick={() => { setIsMenuOpen(false); handleCtaClick('book_workshop', '/book') }}
                  >
                    {t('nav.bookWorkshop', 'Book Workshop')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header