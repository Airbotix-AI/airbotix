// Workshop Preview Hook
// Provides workshop preview functionality for displaying workshop data in main website format

import { useState, useCallback, useMemo } from 'react'
import { workshopService } from '@/services'
import type { NewWorkshop } from '@/types'
import { WORKSHOP_ERROR_MESSAGES } from '@/constants/workshop'

// Preview state interface
export interface UseWorkshopPreviewState {
  workshop: NewWorkshop | null
  loading: boolean
  error: string | null
  isPreviewMode: boolean
}

// Hook return interface
export interface UseWorkshopPreviewReturn extends UseWorkshopPreviewState {
  // Preview operations
  loadWorkshop: (id: string) => Promise<void>
  setWorkshop: (workshop: NewWorkshop) => void
  clearPreview: () => void
  
  // Preview mode
  enterPreviewMode: () => void
  exitPreviewMode: () => void
  
  // Computed values
  hasWorkshop: boolean
  isCompleted: boolean
  isDraft: boolean
  isArchived: boolean
  
  // Preview data formatting
  formattedWorkshop: NewWorkshop | null
  previewUrl: string | null
}

export function useWorkshopPreview(): UseWorkshopPreviewReturn {
  // State management
  const [state, setState] = useState<UseWorkshopPreviewState>({
    workshop: null,
    loading: false,
    error: null,
    isPreviewMode: false,
  })

  // Load workshop by ID
  const loadWorkshop = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await workshopService.getById(id)

      if (!result.success || !result.data) {
        throw new Error(result.error || WORKSHOP_ERROR_MESSAGES.WORKSHOP_LOAD_FAILED)
      }

      setState(prev => ({
        ...prev,
        workshop: result.data,
        loading: false,
        error: null,
      }))
    } catch (error) {
      console.error('Error loading workshop for preview:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
      }))
    }
  }, [])

  // Set workshop directly
  const setWorkshop = useCallback((workshop: NewWorkshop) => {
    setState(prev => ({
      ...prev,
      workshop,
      error: null,
    }))
  }, [])

  // Clear preview
  const clearPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      workshop: null,
      error: null,
      isPreviewMode: false,
    }))
  }, [])

  // Enter preview mode
  const enterPreviewMode = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: true }))
  }, [])

  // Exit preview mode
  const exitPreviewMode = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: false }))
  }, [])

  // Computed values
  const hasWorkshop = useMemo(() => {
    return !!state.workshop
  }, [state.workshop])

  const isCompleted = useMemo(() => {
    return state.workshop?.status === 'completed'
  }, [state.workshop?.status])

  const isDraft = useMemo(() => {
    return state.workshop?.status === 'draft'
  }, [state.workshop?.status])

  const isArchived = useMemo(() => {
    return state.workshop?.status === 'archived'
  }, [state.workshop?.status])

  // Format workshop data for preview
  const formattedWorkshop = useMemo(() => {
    if (!state.workshop) return null

    return {
      ...state.workshop,
      // Ensure all required fields are present for preview
      highlights: state.workshop.highlights || [],
      syllabus: state.workshop.syllabus || [],
      materials: {
        hardware: state.workshop.materials?.hardware || [],
        software: state.workshop.materials?.software || [],
        onlineResources: state.workshop.materials?.onlineResources || [],
      },
      assessment: state.workshop.assessment || [],
      learningOutcomes: state.workshop.learningOutcomes || [],
      media: {
        video: state.workshop.media?.video || { src: '', poster: '', caption: '' },
        photos: state.workshop.media?.photos || [],
      },
      seo: {
        title: state.workshop.seo?.title || state.workshop.title,
        description: state.workshop.seo?.description || state.workshop.overview,
      },
    }
  }, [state.workshop])

  // Generate preview URL
  const previewUrl = useMemo(() => {
    if (!state.workshop) return null
    
    // In a real application, this would be the actual main website URL
    // For now, we'll use a placeholder
    return `/preview/workshops/${state.workshop.slug}`
  }, [state.workshop])

  // Return hook interface
  return {
    // State
    workshop: state.workshop,
    loading: state.loading,
    error: state.error,
    isPreviewMode: state.isPreviewMode,

    // Preview operations
    loadWorkshop,
    setWorkshop,
    clearPreview,

    // Preview mode
    enterPreviewMode,
    exitPreviewMode,

    // Computed values
    hasWorkshop,
    isCompleted,
    isDraft,
    isArchived,

    // Preview data formatting
    formattedWorkshop,
    previewUrl,
  }
}

// Export default
export default useWorkshopPreview