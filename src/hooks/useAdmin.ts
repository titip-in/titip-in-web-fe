import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAdminStore } from '@/stores/adminStore';
import { User, JastipListing, JastipRequest, PrelovedListing, PrelovedRequest, PaginatedData, UserTier } from '@/types/api';
import { toast } from 'sonner';

// Custom axios instance for admin (to attach admin token)
import axios from 'axios';
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = useAdminStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
      window.location.href = '/hidupjokowi/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ────────────────────────────────────────────────────────────

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await adminApi.post('/v1/admin/logout');
    },
    onSuccess: () => {
      useAdminStore.getState().logout();
      queryClient.clear();
      window.location.href = '/hidupjokowi/login';
    },
    onError: () => {
      // Even on error, clear local state
      useAdminStore.getState().logout();
      window.location.href = '/hidupjokowi/login';
    }
  });
}

// ── Users ───────────────────────────────────────────────────────────

export function useAdminUsers(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const response = await adminApi.get<{ success: boolean; message: string; data: PaginatedData<User> }>('/v1/admin/users', {
        params: { page, search }
      });
      return response.data.data;
    }
  });
}

export function useUpdateUserTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, tier }: { id: number; tier: UserTier }) => {
      // API uses PATCH, not PUT
      const response = await adminApi.patch(`/v1/admin/users/${id}/tier`, { tier });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Tier pengguna berhasil diperbarui');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal mengupdate tier');
    }
  });
}

export function useToggleBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; is_banned: boolean }) => {
      // API uses POST (toggle), no body needed
      const response = await adminApi.post(`/v1/admin/users/${id}/ban`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      const isBanned = data?.data?.is_banned;
      toast.success(isBanned ? 'Pengguna berhasil dibanned' : 'Ban pengguna berhasil dicabut');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal mengubah status ban');
    }
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApi.delete(`/v1/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Pengguna berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus pengguna');
    }
  });
}

// ── Items ───────────────────────────────────────────────────────────

export type AdminItemType = 'jastip_listing' | 'jastip_request' | 'preloved_listing' | 'preloved_request';

export function useAdminItems(type: AdminItemType, page = 1) {
  return useQuery({
    queryKey: ['admin-items', type, page],
    queryFn: async () => {
      // API path uses singular type: jastip_listing, not jastip_listings
      const response = await adminApi.get<{ success: boolean; message: string; data: PaginatedData<any> }>(`/v1/admin/items/${type}`, {
        params: { page }
      });
      return response.data.data;
    }
  });
}

export function useAdminForceDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, id }: { type: AdminItemType; id: string }) => {
      // API path uses singular type: jastip_listing, not jastip_listings
      const response = await adminApi.delete(`/v1/admin/items/${type}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      toast.success('Item berhasil dihapus secara paksa');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus item');
    }
  });
}
