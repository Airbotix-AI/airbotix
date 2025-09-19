import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '@/utils/analytics'

const AnalyticsListener = () => {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageView()
  }, [location])

  return null
}

export default AnalyticsListener


