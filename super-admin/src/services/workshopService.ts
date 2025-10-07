import { supabase, type Database } from '@/lib/supabase'
import type {
  Workshop,
  WorkshopFilters,
  WorkshopsResponse,
  WorkshopResponse,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
  WorkshopStatus,
} from '@/types/workshop'

// Centralized constants (no magic strings)
const TABLE = 'workshops' as const

const COLUMNS = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  subtitle: 'subtitle',
  overview: 'overview',
  duration: 'duration',
  targetAudience: 'target_audience',
  startDate: 'start_date',
  endDate: 'end_date',
  status: 'status',
  highlights: 'highlights',
  syllabus: 'syllabus',
  materials: 'materials',
  assessment: 'assessment',
  learningOutcomes: 'learning_outcomes',
  media: 'media',
  seo: 'seo',
  source: 'source',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const

const STATUSES: Record<WorkshopStatus, WorkshopStatus> = {
  draft: 'draft',
  completed: 'completed',
  archived: 'archived',
}

type DbWorkshopRow = Database['public']['Tables']['workshops']['Row']
type DbWorkshopInsert = Database['public']['Tables']['workshops']['Insert']
type DbWorkshopUpdate = Database['public']['Tables']['workshops']['Update']

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

function mapRowToWorkshop(row: DbWorkshopRow): Workshop {
        return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    overview: row.overview,
    duration: row.duration,
    targetAudience: row.target_audience,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    status: row.status,
    highlights: row.highlights as unknown as string[],
    syllabus: row.syllabus as unknown as Workshop['syllabus'],
    materials: row.materials as unknown as Workshop['materials'],
    assessment: row.assessment as unknown as Workshop['assessment'],
    learningOutcomes: row.learning_outcomes as unknown as string[],
    media: row.media as unknown as Workshop['media'],
    seo: row.seo as unknown as Workshop['seo'],
    source: row.source,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function mapCreateToDb(input: CreateWorkshopRequest['workshop']): DbWorkshopInsert {
        return {
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle ?? null,
    overview: input.overview,
    duration: input.duration,
    target_audience: input.targetAudience,
    start_date: toIsoDate(input.startDate),
    end_date: toIsoDate(input.endDate),
    status: input.status,
    highlights: input.highlights as unknown as any,
    syllabus: input.syllabus as unknown as any,
    materials: input.materials as unknown as any,
    assessment: input.assessment as unknown as any,
    learning_outcomes: input.learningOutcomes as unknown as any,
    media: input.media as unknown as any,
    seo: input.seo as unknown as any,
    source: input.source,
  }
}

function mapUpdateToDb(input: UpdateWorkshopRequest['workshop']): DbWorkshopUpdate {
  const update: DbWorkshopUpdate = {}
  if (input.slug !== undefined) update.slug = input.slug
  if (input.title !== undefined) update.title = input.title
  if (input.subtitle !== undefined) update.subtitle = input.subtitle ?? null
  if (input.overview !== undefined) update.overview = input.overview
  if (input.duration !== undefined) update.duration = input.duration
  if (input.targetAudience !== undefined) update.target_audience = input.targetAudience
  if (input.startDate !== undefined) update.start_date = toIsoDate(input.startDate)
  if (input.endDate !== undefined) update.end_date = toIsoDate(input.endDate)
  if (input.status !== undefined) update.status = input.status
  if (input.highlights !== undefined) update.highlights = input.highlights as unknown as any
  if (input.syllabus !== undefined) update.syllabus = input.syllabus as unknown as any
  if (input.materials !== undefined) update.materials = input.materials as unknown as any
  if (input.assessment !== undefined) update.assessment = input.assessment as unknown as any
  if (input.learningOutcomes !== undefined) update.learning_outcomes = input.learningOutcomes as unknown as any
  if (input.media !== undefined) update.media = input.media as unknown as any
  if (input.seo !== undefined) update.seo = input.seo as unknown as any
  if (input.source !== undefined) update.source = input.source
  return update
}

function toIsoDate(value: string | Date): string {
  return typeof value === 'string' ? value : value.toISOString().slice(0, 10)
}

function buildSort(sortBy?: WorkshopFilters['sortBy'], sortOrder?: WorkshopFilters['sortOrder']): string | undefined {
  const direction = sortOrder === 'asc' ? true : false
  switch (sortBy) {
    case 'title':
      return `${COLUMNS.title}.${direction ? 'asc' : 'desc'}`
    case 'startDate':
      return `${COLUMNS.startDate}.${direction ? 'asc' : 'desc'}`
    case 'endDate':
      return `${COLUMNS.endDate}.${direction ? 'asc' : 'desc'}`
    case 'createdAt':
      return `${COLUMNS.createdAt}.${direction ? 'asc' : 'desc'}`
    default:
      return `${COLUMNS.createdAt}.desc`
  }
}

export const workshopService = {
  async list(filters: WorkshopFilters = {}): Promise<ApiResponse<WorkshopsResponse>> {
    const page = Math.max(1, filters.page ?? 1)
    const limit = Math.max(1, Math.min(100, filters.limit ?? 20))
    const from = (page - 1) * limit
    const to = from + limit - 1

      let query = supabase
      .from(TABLE)
        .select('*', { count: 'exact' })

    if (filters.status) {
      query = query.eq(COLUMNS.status, filters.status)
    }

    if (filters.startDate) {
      query = query.gte(COLUMNS.startDate, filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte(COLUMNS.endDate, filters.endDate)
    }

    if (filters.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim()}%`
      query = query.or(
        `${COLUMNS.title}.ilike.${term},${COLUMNS.overview}.ilike.${term}`
      )
    }

    const orderExpr = buildSort(filters.sortBy, filters.sortOrder)
    if (orderExpr) {
      const [col, dir] = orderExpr.split('.')
      query = query.order(col as any, { ascending: dir === 'asc' })
    }

    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) {
      return { success: false, error: error.message }
    }

    const workshops = (data ?? []).map(mapRowToWorkshop)
    const result: WorkshopsResponse = {
      workshops,
      total: count ?? workshops.length,
      page,
      limit,
    }
    return { success: true, data: result }
  },

  async getById(id: string): Promise<ApiResponse<WorkshopResponse>> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(COLUMNS.id, id)
      .single()

    if (error) return { success: false, error: error.message }
    const workshop = mapRowToWorkshop(data as DbWorkshopRow)
    return { success: true, data: { workshop } }
  },

  async create(payload: CreateWorkshopRequest['workshop']): Promise<ApiResponse<WorkshopResponse>> {
    const insertRow = mapCreateToDb(payload)
    const { data, error } = await supabase
      .from(TABLE)
      .insert(insertRow)
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: { workshop: mapRowToWorkshop(data as DbWorkshopRow) } }
  },

  async update(id: string, payload: UpdateWorkshopRequest['workshop']): Promise<ApiResponse<WorkshopResponse>> {
    const updateRow = mapUpdateToDb(payload)
    const { data, error } = await supabase
      .from(TABLE)
      .update(updateRow)
      .eq(COLUMNS.id, id)
      .select('*')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: { workshop: mapRowToWorkshop(data as DbWorkshopRow) } }
  },

  async remove(id: string): Promise<ApiResponse<{ id: string }>> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq(COLUMNS.id, id)

    if (error) return { success: false, error: error.message }
    return { success: true, data: { id } }
  },

  async archive(id: string): Promise<ApiResponse<WorkshopResponse>> {
    return this.update(id, { status: STATUSES.archived })
  },

  async restore(id: string): Promise<ApiResponse<WorkshopResponse>> {
    // Restore to draft by default
    return this.update(id, { status: STATUSES.draft })
  },
}

export type { WorkshopsResponse, WorkshopResponse }
