import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, Category } from "@/types/api";

export function useCategories(type?: 'jastip' | 'preloved') {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/v1/categories', {
        params: { type }
      });
      return data.data;
    }
  });
}
