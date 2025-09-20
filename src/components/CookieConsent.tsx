import { useEffect, useState } from 'react'
import { initAnalytics } from '@/utils/analytics'
import { getConsent, setConsent, isConsented } from '@/utils/consent'

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    if (consent === 'granted') {
      initAnalytics()
      setVisible(false)
    } else if (consent === 'denied') {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('granted')
    initAnalytics()
    setVisible(false)
  }

  const handleDecline = () => {
    setConsent('denied')
    setVisible(false)
  }

  if (!visible || isConsented()) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:transform md:-translate-x-1/2 z-50">
      <div className="max-w-3xl mx-auto bg-white border shadow-xl rounded-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="text-sm text-gray-700 mb-3 md:mb-0">
          We use cookies to analyze traffic and improve your experience. You can accept or decline analytics cookies.
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent


