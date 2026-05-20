import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { AnalyticsResponse, ItemClickType, SubscriptionUpgradePayload, UserTier } from '@/types/api';
import { toast } from 'sonner';

// ── Analytics ────────────────────────────────────────────────────────

export function useAnalytics() {
  const tier = useAuthStore((s) => s.user?.tier);

  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; message: string; data: AnalyticsResponse }>(
        '/v1/me/analytics'
      );
      return response.data.data;
    },
    enabled: tier === 'plus' || tier === 'pro',
    retry: false, // Don't retry on 403
  });
}

// ── Click Tracking ───────────────────────────────────────────────────

/**
 * Fire-and-forget: hit POST /items/{type}/{id}/click in the background.
 * No loading state, no toast — completely transparent to the user.
 */
export function useClickItem() {
  return useMutation({
    mutationFn: async ({ type, id }: { type: ItemClickType; id: string }) => {
      await api.post(`/v1/items/${type}/${id}/click`);
    },
    // Silently fail — user should never see errors from tracking calls
    onError: () => {},
  });
}

// ── Subscription Upgrade ─────────────────────────────────────────────

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: async (payload: SubscriptionUpgradePayload) => {
      const response = await api.post<{ success: boolean; message: string; data: any }>(
        '/v1/me/subscriptions/upgrade',
        payload
      );
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(
        'Permintaan upgrade berhasil dikirim! Admin akan memverifikasi pembayaran Anda.'
      );
      // Refresh profile so tier badge & limits update immediately
      try {
        const userRes = await api.get('/v1/me');
        if (userRes.data.success && token) {
          setAuthUser(userRes.data.data, token);
        }
      } catch (_) {}
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal mengirim permintaan upgrade.';
      toast.error(msg);
    },
  });
}

// ── Delete Account (User soft-delete) ────────────────────────────────

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await api.delete('/v1/me');
    },
    onSuccess: () => {
      toast.success('Akun Anda telah berhasil dihapus.');
      logout();
      // Hard navigate so all React Query cache & zustand state is wiped
      window.location.href = '/landing';
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus akun.');
    },
  });
}
