// Services Index
// Central export for all service modules

export { workshopService } from './workshopService'

// Re-export types for convenience
export type {
  Workshop,
  WorkshopStatus,
  WorkshopFilters,
  WorkshopResponse,
  WorkshopsResponse,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
} from '@/types/workshop'