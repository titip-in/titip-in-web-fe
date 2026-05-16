import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  JastipListing,
  JastipRequest,
  PrelovedListing,
  PrelovedRequest,
  ApiResponse,
} from '@/types/api';

export type ActivityItem = {
  id: string;
  type: 'jastip-listing' | 'jastip-request' | 'preloved-listing' | 'preloved-request';
  title: string;
  user_name: string;
  created_at: string;
  status: string;
  from_loc?: string;
  to_loc?: string;
  price?: number;
  image_url?: string | null;
};

export function useActivity(limit: number = 10) {
  return useQuery({
    queryKey: ['activity', limit],
    queryFn: async () => {
      // We fetch all types in parallel
      const [jListings, jRequests, pListings, pRequests] = await Promise.all([
        api.get<ApiResponse<JastipListing[]>>('/v1/jastip/listings'),
        api.get<ApiResponse<JastipRequest[]>>('/v1/jastip/requests'),
        api.get<ApiResponse<PrelovedListing[]>>('/v1/preloved/listings'),
        api.get<ApiResponse<PrelovedRequest[]>>('/v1/preloved/requests'),
      ]);

      const activities: ActivityItem[] = [
        ...jListings.data.data.map((l) => ({
          id: l.id,
          type: 'jastip-listing' as const,
          title: `Jastip ${l.from_loc}`,
          user_name: l.user?.name || 'Seseorang',
          created_at: l.created_at || '',
          status: l.status,
          from_loc: l.from_loc,
          to_loc: l.to_loc,
          image_url: l.primary_image_url
        })),
        ...jRequests.data.data.map((r) => ({
          id: r.id,
          type: 'jastip-request' as const,
          title: `Request Jastip ${r.from_loc}`,
          user_name: r.user?.name || 'Seseorang',
          created_at: r.created_at || '',
          status: r.status,
          from_loc: r.from_loc,
          to_loc: r.to_loc,
        })),
        ...pListings.data.data.map((l) => ({
          id: l.id,
          type: 'preloved-listing' as const,
          title: l.title,
          user_name: l.user?.name || 'Seseorang',
          created_at: l.created_at || '',
          status: l.status,
          price: l.price,
          image_url: l.primary_image_url
        })),
        ...pRequests.data.data.map((r) => ({
          id: r.id,
          type: 'preloved-request' as const,
          title: `Cari: ${r.title}`,
          user_name: r.user?.name || 'Seseorang',
          created_at: r.created_at || '',
          status: r.status,
        })),
      ];

      // Sort by created_at desc
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    },
  });
}
