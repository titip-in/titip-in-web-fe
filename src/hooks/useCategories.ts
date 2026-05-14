import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category, ApiResponse } from '@/types/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/v1/categories');
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // cache 10 minutes - categories rarely change
  });
}
