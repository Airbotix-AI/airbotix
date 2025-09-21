import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
// Minimal GA per requirement: no consent banner

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CookieConsent />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout