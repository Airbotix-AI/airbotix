import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/utils/analytics'

const AnalyticsListener = () => {
  const location = useLocation()

  useEffect(() => {
    trackPageView()
  }, [location])

  return null
}

export default AnalyticsListener


