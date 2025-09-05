// Workshop Data Management Hook
// Provides comprehensive workshop list management with filtering, search, pagination, and optimistic updates

import { useState, useEffect, useCallback, useMemo } from 'react'
import { workshopService } from '@/services'
import type {
  NewWorkshop,
  NewWorkshopStatus,
  WorkshopFilters,
} from '@/types'
import { WORKSHOP_ERROR_MESSAGES } from '@/constants/workshop'

// Hook state interface
export interface UseWorkshopsState {
  workshops: NewWorkshop[]
  total: number
  page: number
  limit: number
  loading: boolean
  error: string | null
  filters: WorkshopFilters
}

// Hook return interface
export interface UseWorkshopsReturn extends UseWorkshopsState {
  // Data operations
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
  
  // Filtering and search
  setFilters: (filters: Partial<WorkshopFilters>) => void
  setStatus: (status: NewWorkshopStatus | null) => void
  setSearch: (search: string) => void
  setDateRange: (startDate?: string, endDate?: string) => void
  setSorting: (sortBy: 'title' | 'startDate' | 'endDate' | 'createdAt', sortOrder: 'asc' | 'desc') => void
  
  // Pagination
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  
  // Workshop operations with optimistic updates
  createWorkshop: (workshopData: any) => Promise<NewWorkshop | null>
  updateWorkshop: (id: string, updateData: any) => Promise<NewWorkshop | null>
  deleteWorkshop: (id: string) => Promise<boolean>
  archiveWorkshop: (id: string) => Promise<boolean>
  restoreWorkshop: (id: string) => Promise<boolean>
  
  // Computed values
  hasMore: boolean
  isEmpty: boolean
  isFiltered: boolean
}

// Default filters
const DEFAULT_FILTERS: WorkshopFilters = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export function useWorkshops(initialFilters: Partial<WorkshopFilters> = {}): UseWorkshopsReturn {
  // State management
  const [state, setState] = useState<UseWorkshopsState>({
    workshops: [],
    total: 0,
    page: initialFilters.page || DEFAULT_FILTERS.page!,
    limit: initialFilters.limit || DEFAULT_FILTERS.limit!,
    loading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS, ...initialFilters },
  })

  // Optimistic update helper
  const optimisticUpdate = useCallback((id: string, updates: Partial<NewWorkshop>) => {
    setState(prev => ({
      ...prev,
      workshops: prev.workshops.map(workshop =>
        workshop.id === id ? { ...workshop, ...updates } : workshop
      ),
    }))
  }, [])

  // Optimistic add helper
  const optimisticAdd = useCallback((newWorkshop: NewWorkshop) => {
    setState(prev => ({
      ...prev,
      workshops: [newWorkshop, ...prev.workshops],
      total: prev.total + 1,
    }))
  }, [])

  // Optimistic remove helper
  const optimisticRemove = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      workshops: prev.workshops.filter(workshop => workshop.id !== id),
      total: Math.max(0, prev.total - 1),
    }))
  }, [])

  // Fetch workshops function
  const fetchWorkshops = useCallback(async (filters: WorkshopFilters, append = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await workshopService.getAll(filters)

      if (!result.success || !result.data) {
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOPS_LOAD_FAILED)
      }

      if (result.data) {
        setState(prev => ({
          ...prev,
          workshops: append ? [...prev.workshops, ...result.data!.workshops] : result.data!.workshops,
          total: result.data!.total,
          page: result.data!.page,
          limit: result.data!.limit,
          loading: false,
          error: null,
        }))
      }
    } catch (error) {
      console.error('Error fetching workshops:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
      }))
    }
  }, [])

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchWorkshops(state.filters, false)
  }, [fetchWorkshops, state.filters])

  // Load more function
  const loadMore = useCallback(async () => {
    if (state.loading || !hasMore) return

    const nextPage = state.page + 1
    const nextFilters = { ...state.filters, page: nextPage }
    await fetchWorkshops(nextFilters, true)
  }, [fetchWorkshops, state.filters, state.page, state.loading])

  // Set filters function
  const setFilters = useCallback((newFilters: Partial<WorkshopFilters>) => {
    const updatedFilters = { ...state.filters, ...newFilters, page: 1 }
    setState(prev => ({ ...prev, filters: updatedFilters }))
    fetchWorkshops(updatedFilters, false)
  }, [state.filters, fetchWorkshops])

  // Set status filter
  const setStatus = useCallback((status: NewWorkshopStatus | null) => {
    setFilters({ status: status || undefined })
  }, [setFilters])

  // Set search filter
  const setSearch = useCallback((search: string) => {
    setFilters({ search: search || undefined })
  }, [setFilters])

  // Set date range filter
  const setDateRange = useCallback((startDate?: string, endDate?: string) => {
    setFilters({ startDate, endDate })
  }, [setFilters])

  // Set sorting
  const setSorting = useCallback((sortBy: 'title' | 'startDate' | 'endDate' | 'createdAt', sortOrder: 'asc' | 'desc') => {
    setFilters({ sortBy, sortOrder })
  }, [setFilters])

  // Set page
  const setPage = useCallback((page: number) => {
    setFilters({ page })
  }, [setFilters])

  // Set limit
  const setLimit = useCallback((limit: number) => {
    setFilters({ limit })
  }, [setFilters])

  // Create workshop with optimistic update
  const createWorkshop = useCallback(async (workshopData: any): Promise<NewWorkshop | null> => {
    try {
      // Optimistic add
      const tempWorkshop: NewWorkshop = {
        id: `temp-${Date.now()}`,
        ...workshopData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      optimisticAdd(tempWorkshop)

      // Actual API call
      const result = await workshopService.create(workshopData)

      if (!result.success || !result.data) {
        // Revert optimistic update
        optimisticRemove(tempWorkshop.id)
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_CREATE_FAILED)
      }

      // Replace temp workshop with real one
      setState(prev => ({
        ...prev,
        workshops: prev.workshops.map(workshop =>
          workshop.id === tempWorkshop.id ? result.data! : workshop
        ),
      }))

      return result.data
    } catch (error) {
      console.error('Error creating workshop:', error)
      throw error
    }
  }, [optimisticAdd, optimisticRemove])

  // Update workshop with optimistic update
  const updateWorkshop = useCallback(async (id: string, updateData: any): Promise<NewWorkshop | null> => {
    try {
      // Store original workshop for rollback
      const originalWorkshop = state.workshops.find(w => w.id === id)
      if (!originalWorkshop) {
        throw new Error('Workshop not found')
      }

      // Optimistic update
      optimisticUpdate(id, updateData)

      // Actual API call
      const result = await workshopService.update(id, { workshop: updateData })

      if (!result.success || !result.data) {
        // Revert optimistic update
        optimisticUpdate(id, originalWorkshop)
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_UPDATE_FAILED)
      }

      return result.data
    } catch (error) {
      console.error('Error updating workshop:', error)
      throw error
    }
  }, [state.workshops, optimisticUpdate])

  // Delete workshop with optimistic update
  const deleteWorkshop = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Store original workshop for rollback
      const originalWorkshop = state.workshops.find(w => w.id === id)
      if (!originalWorkshop) {
        throw new Error('Workshop not found')
      }

      // Optimistic remove
      optimisticRemove(id)

      // Actual API call
      const result = await workshopService.delete(id)

      if (!result.success) {
        // Revert optimistic update
        optimisticAdd(originalWorkshop)
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_DELETE_FAILED)
      }

      return true
    } catch (error) {
      console.error('Error deleting workshop:', error)
      throw error
    }
  }, [state.workshops, optimisticRemove, optimisticAdd])

  // Archive workshop with optimistic update
  const archiveWorkshop = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Optimistic update
      optimisticUpdate(id, { status: 'archived' })

      // Actual API call
      const result = await workshopService.archive(id)

      if (!result.success) {
        // Revert optimistic update
        optimisticUpdate(id, { status: 'completed' })
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_UPDATE_FAILED)
      }

      return true
    } catch (error) {
      console.error('Error archiving workshop:', error)
      throw error
    }
  }, [optimisticUpdate])

  // Restore workshop with optimistic update
  const restoreWorkshop = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Optimistic update
      optimisticUpdate(id, { status: 'completed' })

      // Actual API call
      const result = await workshopService.restore(id)

      if (!result.success) {
        // Revert optimistic update
        optimisticUpdate(id, { status: 'archived' })
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_UPDATE_FAILED)
      }

      return true
    } catch (error) {
      console.error('Error restoring workshop:', error)
      throw error
    }
  }, [optimisticUpdate])

  // Computed values
  const hasMore = useMemo(() => {
    return state.workshops.length < state.total
  }, [state.workshops.length, state.total])

  const isEmpty = useMemo(() => {
    return !state.loading && state.workshops.length === 0
  }, [state.loading, state.workshops.length])

  const isFiltered = useMemo(() => {
    return !!(
      state.filters.status ||
      state.filters.search ||
      state.filters.startDate ||
      state.filters.endDate
    )
  }, [state.filters])

  // Initial load
  useEffect(() => {
    fetchWorkshops(state.filters, false)
  }, []) // Only run on mount

  // Return hook interface
  return {
    // State
    workshops: state.workshops,
    total: state.total,
    page: state.page,
    limit: state.limit,
    loading: state.loading,
    error: state.error,
    filters: state.filters,

    // Data operations
    refetch,
    loadMore,

    // Filtering and search
    setFilters,
    setStatus,
    setSearch,
    setDateRange,
    setSorting,

    // Pagination
    setPage,
    setLimit,

    // Workshop operations
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    archiveWorkshop,
    restoreWorkshop,

    // Computed values
    hasMore,
    isEmpty,
    isFiltered,
  }
}

// Export default
export default useWorkshops
