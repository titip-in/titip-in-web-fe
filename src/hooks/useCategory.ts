import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, Category } from "@/types/api";

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/v1/categories');
      return data.data;
    }
  });
}
