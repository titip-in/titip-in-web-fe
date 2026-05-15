import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  PrelovedListing,
  PrelovedRequest,
  ApiResponse,
  PaginatedData,
  CreatePrelovedListingPayload,
  CreatePrelovedRequestPayload,
} from '@/types/api';

export const prelovedKeys = {
  all: ['preloved'] as const,
  listings: () => [...prelovedKeys.all, 'listings'] as const,
  myListings: () => [...prelovedKeys.all, 'listings', 'mine'] as const,
  listingDetail: (id: string) => [...prelovedKeys.all, 'listing', id] as const,
  requests: () => [...prelovedKeys.all, 'requests'] as const,
  myRequests: () => [...prelovedKeys.all, 'requests', 'mine'] as const,
  requestDetail: (id: string) => [...prelovedKeys.all, 'request', id] as const,
};

// ── Listings ──────────────────────────────────────────────

export function usePrelovedListings() {
  return useQuery({
    queryKey: prelovedKeys.listings(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PrelovedListing[]>>('/v1/preloved/listings');
      return data.data;
    },
  });
}

// /v1/me/preloved/listings returns PAGINATED data
export function useMyPrelovedListings() {
  return useQuery({
    queryKey: prelovedKeys.myListings(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedData<PrelovedListing>>>('/v1/me/preloved/listings');
      return data.data.data; // paginated → extract items array
    },
  });
}

export function usePrelovedListingDetail(id: string) {
  return useQuery({
    queryKey: prelovedKeys.listingDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PrelovedListing>>(`/v1/preloved/listings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePrelovedListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePrelovedListingPayload) => {
      const { data } = await api.post<ApiResponse<PrelovedListing>>('/v1/preloved/listings', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.listings() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myListings() });
    },
  });
}

export function useUpdatePrelovedListing(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreatePrelovedListingPayload>) => {
      const { data } = await api.put<ApiResponse<PrelovedListing>>(`/v1/preloved/listings/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.listings() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.listingDetail(id) });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myListings() });
    },
  });
}

export function useDeletePrelovedListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/preloved/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.listings() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myListings() });
    },
  });
}

// ── Requests ──────────────────────────────────────────────

export function usePrelovedRequests() {
  return useQuery({
    queryKey: prelovedKeys.requests(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PrelovedRequest[]>>('/v1/preloved/requests');
      return data.data;
    },
  });
}

// /v1/me/preloved/requests returns PAGINATED data
export function useMyPrelovedRequests() {
  return useQuery({
    queryKey: prelovedKeys.myRequests(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedData<PrelovedRequest>>>('/v1/me/preloved/requests');
      return data.data.data; // paginated → extract items array
    },
  });
}

export function usePrelovedRequestDetail(id: string) {
  return useQuery({
    queryKey: prelovedKeys.requestDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PrelovedRequest>>(`/v1/preloved/requests/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePrelovedRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePrelovedRequestPayload) => {
      const { data } = await api.post<ApiResponse<PrelovedRequest>>('/v1/preloved/requests', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.requests() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myRequests() });
    },
  });
}

export function useUpdatePrelovedRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreatePrelovedRequestPayload>) => {
      const { data } = await api.put<ApiResponse<PrelovedRequest>>(`/v1/preloved/requests/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.requests() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.requestDetail(id) });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myRequests() });
    },
  });
}

export function useDeletePrelovedRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/preloved/requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prelovedKeys.requests() });
      queryClient.invalidateQueries({ queryKey: prelovedKeys.myRequests() });
    },
  });
}
