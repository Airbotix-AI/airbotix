import { USER_ROLES } from '../constants/userRoles'

export interface User {
  id: string
  email: string
  role: typeof USER_ROLES[keyof typeof USER_ROLES]
  created_at: string
  updated_at: string
}

export interface UserProfile {
  user_id: string
  name: string
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  profile: UserProfile
}
