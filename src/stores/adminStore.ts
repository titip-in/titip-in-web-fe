import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Admin } from '@/types/api'

interface AdminState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (admin: Admin, token: string) => void
  logout: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      setAuth: (admin, token) => {
        set({ admin, token, isAuthenticated: true })
      },

      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'titip-admin-auth',
      partialize: (state) => ({ admin: state.admin, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
