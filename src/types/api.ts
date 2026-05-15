// ============================================================
// API Types — sesuai api-docs-update.json
// Base URL: https://titipin-api.bccdev.id/api
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// ── Paginated Response (for /v1/me/* endpoints) ──────────
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// ── User ──────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  wa_number: string;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// ── Category ──────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  icon: string | null;
  type: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ListingImage {
  id: number;
  imageable_type: string;
  imageable_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// ── Jastip Listing ────────────────────────────────────────
export interface JastipListing {
  id: string; // UUID string
  user_id: number;
  category_id: number | null;
  from_loc: string;
  to_loc: string;
  deadline: string;
  status: 'ACTIVE' | 'CLOSED';
  primary_image_url: string | null;
  images: ListingImage[];
  lat: string | null;
  lng: string | null;
  created_at: string | null;
  updated_at: string | null;
  embedding?: string | null;
  // Relasi (jika di-include backend)
  user?: User;
  category?: Category;
}

export interface CreateJastipListingPayload {
  category_id?: number | null;
  from_loc: string;
  to_loc: string;
  deadline: string;
  status?: 'ACTIVE' | 'CLOSED';
  primary_image_url?: string | null;
  images: string[];
  lat?: number | null;
  lng?: number | null;
}

// ── Jastip Request ────────────────────────────────────────
export interface JastipRequest {
  id: string; // UUID string
  user_id: number;
  category_id: number | null;
  from_loc: string;
  to_loc: string;
  notes: string | null;
  status: 'OPEN' | 'TAKEN' | 'CLOSED';
  created_at: string | null;
  updated_at: string | null;
  // Relasi
  user?: User;
  category?: Category;
}

export interface CreateJastipRequestPayload {
  category_id?: number | null;
  from_loc: string;
  to_loc: string;
  notes?: string | null;
  status?: 'OPEN' | 'TAKEN' | 'CLOSED';
}

// ── Preloved Listing ──────────────────────────────────────
export interface PrelovedListing {
  id: string; // UUID string
  user_id: number;
  category_id: number | null;
  title: string;
  description: string | null;
  price: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  primary_image_url: string | null;
  images: ListingImage[];
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  created_at: string | null;
  updated_at: string | null;
  embedding?: string | null;
  // Relasi
  user?: User;
  category?: Category;
}

export interface CreatePrelovedListingPayload {
  category_id?: number | null;
  title: string;
  description?: string | null;
  price: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  primary_image_url?: string | null;
  images: string[];
  status?: 'AVAILABLE' | 'SOLD' | 'RESERVED';
}

// ── Preloved Request ──────────────────────────────────────
export interface PrelovedRequest {
  id: string; // UUID string
  user_id: number;
  category_id: number | null;
  title: string;
  description: string | null;
  max_price: number | null;
  status: 'OPEN' | 'FOUND' | 'CLOSED';
  created_at: string | null;
  updated_at: string | null;
  // Relasi
  user?: User;
  category?: Category;
}

export interface CreatePrelovedRequestPayload {
  category_id?: number | null;
  title: string;
  description?: string | null;
  max_price?: number | null;
  status?: 'OPEN' | 'FOUND' | 'CLOSED';
}

// ── Upload ────────────────────────────────────────────────
export interface UploadResponse {
  image_url: string;
}

// ── Search ────────────────────────────────────────────────
export interface SearchCursorPaginated<T> {
  data: T[];
  path: string | null;
  per_page: number;
  next_cursor: string | null;
  next_page_url: string | null;
  prev_cursor: string | null;
  prev_page_url: string | null;
}
