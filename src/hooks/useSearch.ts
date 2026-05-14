import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  PrelovedListing,
  JastipListing,
  ApiResponse,
  SearchCursorPaginated,
} from '@/types/api';

export function useSearch(query: string, type: 'jastip' | 'preloved') {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SearchCursorPaginated<PrelovedListing | JastipListing>>>('/v1/search', {
        params: { q: query, type },
      });
      return data.data.data; // cursor-paginated → items array
    },
    enabled: query.length >= 2,
  });
}
