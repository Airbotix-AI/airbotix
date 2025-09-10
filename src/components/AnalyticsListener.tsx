import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { loadGA, pageview } from '../utils/analytics'

const AnalyticsListener = () => {
  const location = useLocation()

  useEffect(() => {
    // Initialize GA once on mount
    loadGA()
    // send initial page_view
    pageview(window.location.pathname + window.location.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    pageview(location.pathname + location.search)
  }, [location.pathname, location.search])

  return null
}

export default AnalyticsListener


