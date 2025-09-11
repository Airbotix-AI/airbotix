/**
 * React Query Client Configuration
 * 
 * Centralized configuration for React Query with optimized defaults for
 * Student Management application. Includes error handling, retry logic,
 * and performance optimizations.
 * 
 * @file queryClient.ts
 * @version 1.0.0
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Default query configuration optimized for Supabase
 */
const queryConfig = {
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // GC time: How long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests up to 3 times
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus in development
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      
      // Don't refetch on reconnect unless data is stale
      refetchOnReconnect: true,
      
      // Background refetching interval (5 minutes)
      refetchInterval: 5 * 60 * 1000,
      
      // Only refetch in background if window is focused
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
}

/**
 * Create and configure React Query client
 */
export const queryClient = new QueryClient(queryConfig)

/**
 * Query key prefixes for better organization
 */
export const QUERY_KEYS = {
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  WORKSHOPS: 'workshops',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  STATISTICS: 'statistics',
  AUDIT_LOGS: 'audit_logs',
} as const

/**
 * Utility function to invalidate all student-related queries
 */
export const invalidateStudentQueries = () => {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATISTICS] })
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] })
}

/**
 * Utility function to clear all cached data
 */
export const clearAllCache = () => {
  queryClient.clear()
}

/**
 * Utility function to prefetch student data
 */
export const prefetchStudents = (filters?: any) => {
  return queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.STUDENTS, 'list', filters],
    queryFn: () => import('../services/student.service').then(service => 
      service.fetchAllStudents(filters)
    ),
  })
}
