// ============================================================
// API Response Wrapper
// ============================================================
export interface ApiResponse<T> {
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// ============================================================
// User
// ============================================================
export type UserRole = 'user' | 'merchant' | 'admin'

export interface User {
  id: string
  name: string
  whatsapp_number: string
  email: string
  profile_picture_url: string | null
  role: UserRole
  created_at: string
}

// ============================================================
// Jastip
// ============================================================
export type JastipType = 'available' | 'request'

export interface JastipListing {
  id: string
  user: User
  type: JastipType
  origin: string
  destination: string
  departure_date: string
  fee: number
  capacity: number
  description: string
  is_active: boolean
  is_featured: boolean
  created_at: string
}

// ============================================================
// Preloved
// ============================================================
export type PrelovedType = 'sell' | 'find'
export type PrelovedCondition = 'new' | 'like_new' | 'good' | 'fair'

export interface PrelovedListing {
  id: string
  user: User
  type: PrelovedType
  title: string
  description: string
  price: number
  category: string
  condition: PrelovedCondition
  image_urls: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
}

// ============================================================
// Auth
// ============================================================
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  whatsapp_number: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  token: string
}
