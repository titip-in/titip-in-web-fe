import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

type BoostType = 'jastip_listing' | 'jastip_request' | 'preloved_listing' | 'preloved_request';

export function useBoostItem() {
  const queryClient = useQueryClient();
  const updateBoostQuota = useAuthStore((state) => state.updateBoostQuota);

  return useMutation({
    mutationFn: async ({ type, id }: { type: BoostType; id: string }) => {
      // Determine endpoint based on type
      let endpoint = '';
      if (type === 'jastip_listing') endpoint = `/v1/jastip/listings/${id}/boost`;
      else if (type === 'jastip_request') endpoint = `/v1/jastip/requests/${id}/boost`;
      else if (type === 'preloved_listing') endpoint = `/v1/preloved/listings/${id}/boost`;
      else if (type === 'preloved_request') endpoint = `/v1/preloved/requests/${id}/boost`;

      const response = await api.post(endpoint);
      return response.data;
    },
    onSuccess: (data, { type }) => {
      toast.success('Listing berhasil dipromosikan! 🚀');
      
      // Update global boost quota in auth store
      if (data.data?.remaining_quota !== undefined) {
        updateBoostQuota(data.data.remaining_quota);
      }

      // Invalidate relevant queries so the UI updates
      if (type.startsWith('jastip')) {
        queryClient.invalidateQueries({ queryKey: ['jastip'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['preloved'] });
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Gagal melakukan boost.';
      if (error?.response?.status === 403) {
        toast.error('Kuota boost habis. Silakan upgrade plan Anda.');
      } else {
        toast.error(msg);
      }
    },
  });
}
