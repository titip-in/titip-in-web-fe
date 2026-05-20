import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { User } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  authError: 'PROFILE_INCOMPLETE' | 'EMAIL_UNVERIFIED' | 'WA_UNVERIFIED' | null
  setAuth: (user: User, token: string) => void
  setAuthError: (error: 'PROFILE_INCOMPLETE' | 'EMAIL_UNVERIFIED' | 'WA_UNVERIFIED' | null) => void
  updateBoostQuota: (quota: number) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      authError: null,

      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token)
        set({ user, token, isAuthenticated: true })
      },

      setAuthError: (error) => {
        set({ authError: error })
      },

      updateBoostQuota: (quota) => {
        set((state) => ({
          user: state.user ? { ...state.user, boost_quota: quota } : null
        }))
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'titip-auth',
      // Hanya persist user & token, bukan fungsi
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
