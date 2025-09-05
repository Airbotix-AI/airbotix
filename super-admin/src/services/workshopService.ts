// Workshop API Service
// Comprehensive CRUD operations with filtering, search, pagination, and error handling

import { supabase } from '@/lib/supabase'
import type {
  NewWorkshop,
  NewWorkshopStatus,
  WorkshopFilters,
  WorkshopsResponse,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
} from '@/types'
import { WORKSHOP_ERROR_MESSAGES } from '@/constants/workshop'

// API Response wrapper for consistent error handling
interface ApiResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Workshop Service Class
export class WorkshopService {
  private static readonly TABLE_NAME = 'workshops'
  private static readonly DEFAULT_PAGE_SIZE = 20
  private static readonly MAX_PAGE_SIZE = 100

  /**
   * Create a new workshop
   */
  static async createWorkshop(workshopData: CreateWorkshopRequest): Promise<ApiResult<NewWorkshop>> {
    try {
      // Validate required fields
      const validationError = this.validateWorkshopData(workshopData.workshop)
      if (validationError) {
        return {
          data: null,
          error: validationError,
          success: false,
        }
      }

      // Generate slug from title
      const slug = this.generateSlug(workshopData.workshop.title)

      // Prepare data for database
      const dbData = this.transformWorkshopToDb(workshopData.workshop, slug)

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([dbData])
        .select()
        .single()

      if (error) {
        console.error('Workshop creation error:', error)
        return {
          data: null,
          error: WORKSHOP_ERROR_MESSAGES.WORKSHOP_CREATE_FAILED,
          success: false,
        }
      }

      return {
        data: this.transformDbToWorkshop(data),
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error creating workshop:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Get a single workshop by ID
   */
  static async getWorkshop(id: string): Promise<ApiResult<NewWorkshop>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Workshop fetch error:', error)
        return {
          data: null,
          error: WORKSHOP_ERROR_MESSAGES.WORKSHOP_LOAD_FAILED,
          success: false,
        }
      }

      if (!data) {
        return {
          data: null,
          error: 'Workshop not found',
          success: false,
        }
      }

      return {
        data: this.transformDbToWorkshop(data),
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error fetching workshop:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Get workshops with filtering, search, and pagination
   */
  static async getWorkshops(filters: WorkshopFilters = {}): Promise<ApiResult<WorkshopsResponse>> {
    try {
      const {
        status,
        startDate,
        endDate,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
        page = 1,
        limit = this.DEFAULT_PAGE_SIZE,
      } = filters

      // Validate pagination parameters
      const validatedLimit = Math.min(Math.max(limit, 1), this.MAX_PAGE_SIZE)
      const validatedPage = Math.max(page, 1)
      const offset = (validatedPage - 1) * validatedLimit

      // Build query
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact' })

      // Apply filters
      if (status) {
        query = query.eq('status', status)
      }

      if (startDate) {
        query = query.gte('start_date', startDate)
      }

      if (endDate) {
        query = query.lte('end_date', endDate)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,overview.ilike.%${search}%,target_audience.ilike.%${search}%`)
      }

      // Apply sorting - convert camelCase to snake_case for database
      const dbSortBy = this.convertToDbFieldName(sortBy)
      query = query.order(dbSortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      query = query.range(offset, offset + validatedLimit - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Workshops fetch error:', error)
        return {
          data: null,
          error: WORKSHOP_ERROR_MESSAGES.WORKSHOPS_LOAD_FAILED,
          success: false,
        }
      }

      const workshops = data?.map(this.transformDbToWorkshop) || []

      return {
        data: {
          workshops,
          total: count || 0,
          page: validatedPage,
          limit: validatedLimit,
        },
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error fetching workshops:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Update an existing workshop
   */
  static async updateWorkshop(id: string, updateData: UpdateWorkshopRequest): Promise<ApiResult<NewWorkshop>> {
    try {
      // Validate update data
      if (updateData.workshop && Object.keys(updateData.workshop).length === 0) {
        return {
          data: null,
          error: 'No update data provided',
          success: false,
        }
      }

      // Prepare update data with proper field mapping
      const dbUpdateData: any = {
        updated_at: new Date().toISOString(),
      }

      // Map camelCase fields to snake_case database fields
      if (updateData.workshop?.title) {
        dbUpdateData.title = updateData.workshop.title
        dbUpdateData.slug = this.generateSlug(updateData.workshop.title)
      }
      if (updateData.workshop?.subtitle !== undefined) {
        dbUpdateData.subtitle = updateData.workshop.subtitle
      }
      if (updateData.workshop?.overview) {
        dbUpdateData.overview = updateData.workshop.overview
      }
      if (updateData.workshop?.duration) {
        dbUpdateData.duration = updateData.workshop.duration
      }
      if (updateData.workshop?.targetAudience) {
        dbUpdateData.target_audience = updateData.workshop.targetAudience
      }
      if (updateData.workshop?.startDate) {
        dbUpdateData.start_date = updateData.workshop.startDate.toISOString().split('T')[0]
      }
      if (updateData.workshop?.endDate) {
        dbUpdateData.end_date = updateData.workshop.endDate.toISOString().split('T')[0]
      }
      if (updateData.workshop?.status) {
        dbUpdateData.status = updateData.workshop.status
      }
      if (updateData.workshop?.highlights) {
        dbUpdateData.highlights = updateData.workshop.highlights
      }
      if (updateData.workshop?.syllabus) {
        dbUpdateData.syllabus = updateData.workshop.syllabus
      }
      if (updateData.workshop?.materials) {
        dbUpdateData.materials = updateData.workshop.materials
      }
      if (updateData.workshop?.assessment) {
        dbUpdateData.assessment = updateData.workshop.assessment
      }
      if (updateData.workshop?.learningOutcomes) {
        dbUpdateData.learning_outcomes = updateData.workshop.learningOutcomes
      }
      if (updateData.workshop?.media) {
        dbUpdateData.media = updateData.workshop.media
      }
      if (updateData.workshop?.seo) {
        dbUpdateData.seo = updateData.workshop.seo
      }
      if (updateData.workshop?.source) {
        dbUpdateData.source = updateData.workshop.source
      }

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Workshop update error:', error)
        return {
          data: null,
          error: WORKSHOP_ERROR_MESSAGES.WORKSHOP_UPDATE_FAILED,
          success: false,
        }
      }

      return {
        data: this.transformDbToWorkshop(data),
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error updating workshop:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Delete a workshop
   */
  static async deleteWorkshop(id: string): Promise<ApiResult<boolean>> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Workshop deletion error:', error)
        return {
          data: null,
          error: WORKSHOP_ERROR_MESSAGES.WORKSHOP_DELETE_FAILED,
          success: false,
        }
      }

      return {
        data: true,
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error deleting workshop:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Archive a workshop (soft delete by changing status)
   */
  static async archiveWorkshop(id: string): Promise<ApiResult<NewWorkshop>> {
    return this.updateWorkshop(id, {
      workshop: { status: 'archived' as NewWorkshopStatus },
    })
  }

  /**
   * Restore an archived workshop
   */
  static async restoreWorkshop(id: string): Promise<ApiResult<NewWorkshop>> {
    return this.updateWorkshop(id, {
      workshop: { status: 'completed' as NewWorkshopStatus },
    })
  }

  /**
   * Get workshops by status
   */
  static async getWorkshopsByStatus(status: NewWorkshopStatus): Promise<ApiResult<NewWorkshop[]>> {
    const result = await this.getWorkshops({ status })
    return {
      data: result.data?.workshops || null,
      error: result.error,
      success: result.success,
    }
  }

  /**
   * Search workshops by title or content
   */
  static async searchWorkshops(searchTerm: string): Promise<ApiResult<NewWorkshop[]>> {
    const result = await this.getWorkshops({ search: searchTerm })
    return {
      data: result.data?.workshops || null,
      error: result.error,
      success: result.success,
    }
  }

  /**
   * Get workshops within date range
   */
  static async getWorkshopsByDateRange(startDate: string, endDate: string): Promise<ApiResult<NewWorkshop[]>> {
    const result = await this.getWorkshops({ startDate, endDate })
    return {
      data: result.data?.workshops || null,
      error: result.error,
      success: result.success,
    }
  }

  /**
   * Check if workshop slug is unique
   */
  static async isSlugUnique(slug: string, excludeId?: string): Promise<ApiResult<boolean>> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('id')
        .eq('slug', slug)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Slug uniqueness check error:', error)
        return {
          data: null,
          error: 'Failed to check slug uniqueness',
          success: false,
        }
      }

      return {
        data: data?.length === 0,
        error: null,
        success: true,
      }
    } catch (error) {
      console.error('Unexpected error checking slug uniqueness:', error)
      return {
        data: null,
        error: WORKSHOP_ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      }
    }
  }

  /**
   * Transform database row to Workshop interface
   */
  private static transformDbToWorkshop(dbRow: any): NewWorkshop {
    return {
      id: dbRow.id,
      slug: dbRow.slug,
      title: dbRow.title,
      subtitle: dbRow.subtitle,
      overview: dbRow.overview,
      duration: dbRow.duration,
      targetAudience: dbRow.target_audience,
      startDate: new Date(dbRow.start_date),
      endDate: new Date(dbRow.end_date),
      status: dbRow.status,
      highlights: dbRow.highlights || [],
      syllabus: dbRow.syllabus || [],
      materials: dbRow.materials || { hardware: [], software: [], onlineResources: [] },
      assessment: dbRow.assessment || [],
      learningOutcomes: dbRow.learning_outcomes || [],
      media: dbRow.media || { video: { src: '' }, photos: [] },
      seo: dbRow.seo || { title: '', description: '' },
      source: dbRow.source,
      createdAt: new Date(dbRow.created_at),
      updatedAt: new Date(dbRow.updated_at),
    }
  }

  /**
   * Transform Workshop interface to database format
   */
  private static transformWorkshopToDb(workshop: Omit<NewWorkshop, 'id' | 'createdAt' | 'updatedAt'>, slug: string): any {
    return {
      slug,
      title: workshop.title,
      subtitle: workshop.subtitle,
      overview: workshop.overview,
      duration: workshop.duration,
      target_audience: workshop.targetAudience,
      start_date: workshop.startDate.toISOString().split('T')[0],
      end_date: workshop.endDate.toISOString().split('T')[0],
      status: workshop.status,
      highlights: workshop.highlights,
      syllabus: workshop.syllabus,
      materials: workshop.materials,
      assessment: workshop.assessment,
      learning_outcomes: workshop.learningOutcomes,
      media: workshop.media,
      seo: workshop.seo,
      source: workshop.source,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Convert camelCase field names to snake_case for database
   */
  private static convertToDbFieldName(fieldName: string): string {
    const fieldMap: Record<string, string> = {
      'title': 'title',
      'startDate': 'start_date',
      'endDate': 'end_date',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
    }
    
    return fieldMap[fieldName] || fieldName
  }

  /**
   * Validate workshop data
   */
  private static validateWorkshopData(workshop: any): string | null {
    if (!workshop.title || workshop.title.trim().length === 0) {
      return 'Title is required'
    }

    if (!workshop.overview || workshop.overview.trim().length === 0) {
      return 'Overview is required'
    }

    if (!workshop.duration || workshop.duration.trim().length === 0) {
      return 'Duration is required'
    }

    if (!workshop.targetAudience || workshop.targetAudience.trim().length === 0) {
      return 'Target audience is required'
    }

    if (!workshop.startDate || !workshop.endDate) {
      return 'Start date and end date are required'
    }

    if (new Date(workshop.endDate) <= new Date(workshop.startDate)) {
      return 'End date must be after start date'
    }

    if (!workshop.status || !['draft', 'completed', 'archived'].includes(workshop.status)) {
      return 'Valid status is required'
    }

    if (!workshop.highlights || workshop.highlights.length === 0) {
      return 'At least one highlight is required'
    }

    if (!workshop.syllabus || workshop.syllabus.length === 0) {
      return 'At least one syllabus day is required'
    }

    if (!workshop.materials || !workshop.materials.hardware || workshop.materials.hardware.length === 0) {
      return 'At least one hardware item is required'
    }

    if (!workshop.materials || !workshop.materials.software || workshop.materials.software.length === 0) {
      return 'At least one software item is required'
    }

    if (!workshop.materials || !workshop.materials.onlineResources || workshop.materials.onlineResources.length === 0) {
      return 'At least one online resource is required'
    }

    if (!workshop.assessment || workshop.assessment.length === 0) {
      return 'At least one assessment item is required'
    }

    if (!workshop.learningOutcomes || workshop.learningOutcomes.length === 0) {
      return 'At least one learning outcome is required'
    }

    if (!workshop.media || !workshop.media.video || !workshop.media.video.src) {
      return 'Video is required'
    }

    if (!workshop.media || !workshop.media.photos || workshop.media.photos.length === 0) {
      return 'At least one photo is required'
    }

    if (!workshop.seo || !workshop.seo.title || workshop.seo.title.trim().length === 0) {
      return 'SEO title is required'
    }

    if (!workshop.seo || !workshop.seo.description || workshop.seo.description.trim().length === 0) {
      return 'SEO description is required'
    }

    if (!workshop.source || workshop.source.trim().length === 0) {
      return 'Source is required'
    }

    return null
  }
}

// Export convenience functions for direct use
export const workshopService = {
    create: (...args: Parameters<typeof WorkshopService.createWorkshop>) =>
      WorkshopService.createWorkshop(...args),
    getById: (...args: Parameters<typeof WorkshopService.getWorkshop>) =>
      WorkshopService.getWorkshop(...args),
    getAll: (...args: Parameters<typeof WorkshopService.getWorkshops>) =>
      WorkshopService.getWorkshops(...args),
    update: (...args: Parameters<typeof WorkshopService.updateWorkshop>) =>
      WorkshopService.updateWorkshop(...args),
    delete: (...args: Parameters<typeof WorkshopService.deleteWorkshop>) =>
      WorkshopService.deleteWorkshop(...args),
    archive: (...args: Parameters<typeof WorkshopService.archiveWorkshop>) =>
      WorkshopService.archiveWorkshop(...args),
    restore: (...args: Parameters<typeof WorkshopService.restoreWorkshop>) =>
      WorkshopService.restoreWorkshop(...args),
    getByStatus: (...args: Parameters<typeof WorkshopService.getWorkshopsByStatus>) =>
      WorkshopService.getWorkshopsByStatus(...args),
    search: (...args: Parameters<typeof WorkshopService.searchWorkshops>) =>
      WorkshopService.searchWorkshops(...args),
    getByDateRange: (...args: Parameters<typeof WorkshopService.getWorkshopsByDateRange>) =>
      WorkshopService.getWorkshopsByDateRange(...args),
    isSlugUnique: (...args: Parameters<typeof WorkshopService.isSlugUnique>) =>
      WorkshopService.isSlugUnique(...args),
  }

// Export the service class for advanced usage
export default WorkshopService
