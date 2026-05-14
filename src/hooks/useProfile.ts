import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, User } from '@/types/api';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/v1/me');
      return data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name?: string; wa_number?: string; avatar_url?: string | null }) => {
      const { data } = await api.put<ApiResponse<User>>('/v1/me', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}
