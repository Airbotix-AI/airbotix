// Services Index
// Central export for all service modules

export { WorkshopService, workshopService } from './workshopService'

// Re-export types for convenience
export type {
  NewWorkshop,
  NewWorkshopStatus,
  WorkshopFilters,
  WorkshopResponse,
  WorkshopsResponse,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
} from '@/types'