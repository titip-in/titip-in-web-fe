import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  JastipListing,
  JastipRequest,
  ApiResponse,
  PaginatedData,
  CreateJastipListingPayload,
  CreateJastipRequestPayload,
} from '@/types/api';

export const jastipKeys = {
  all: ['jastip'] as const,
  listings: () => [...jastipKeys.all, 'listings'] as const,
  myListings: () => [...jastipKeys.all, 'listings', 'mine'] as const,
  listingDetail: (id: string) => [...jastipKeys.all, 'listing', id] as const,
  requests: () => [...jastipKeys.all, 'requests'] as const,
  myRequests: () => [...jastipKeys.all, 'requests', 'mine'] as const,
  requestDetail: (id: string) => [...jastipKeys.all, 'request', id] as const,
};

// ── Listings ──────────────────────────────────────────────

export function useJastipListings() {
  return useQuery({
    queryKey: jastipKeys.listings(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<JastipListing[]>>('/v1/jastip/listings');
      return data.data;
    },
  });
}

// /v1/me/jastip/listings returns PAGINATED data
export function useMyJastipListings() {
  return useQuery({
    queryKey: jastipKeys.myListings(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedData<JastipListing>>>('/v1/me/jastip/listings');
      return data.data.data; // paginated → extract items array
    },
  });
}

export function useJastipListingDetail(id: string) {
  return useQuery({
    queryKey: jastipKeys.listingDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<JastipListing>>(`/v1/jastip/listings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateJastipListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJastipListingPayload) => {
      const { data } = await api.post<ApiResponse<JastipListing>>('/v1/jastip/listings', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.listings() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myListings() });
    },
  });
}

export function useUpdateJastipListing(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreateJastipListingPayload>) => {
      const { data } = await api.put<ApiResponse<JastipListing>>(`/v1/jastip/listings/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.listings() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.listingDetail(id) });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myListings() });
    },
  });
}

export function useDeleteJastipListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/jastip/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.listings() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myListings() });
    },
  });
}

// ── Requests ──────────────────────────────────────────────

export function useJastipRequests() {
  return useQuery({
    queryKey: jastipKeys.requests(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<JastipRequest[]>>('/v1/jastip/requests');
      return data.data;
    },
  });
}

// /v1/me/jastip/requests returns PAGINATED data
export function useMyJastipRequests() {
  return useQuery({
    queryKey: jastipKeys.myRequests(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedData<JastipRequest>>>('/v1/me/jastip/requests');
      return data.data.data; // paginated → extract items array
    },
  });
}

export function useJastipRequestDetail(id: string) {
  return useQuery({
    queryKey: jastipKeys.requestDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<JastipRequest>>(`/v1/jastip/requests/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateJastipRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJastipRequestPayload) => {
      const { data } = await api.post<ApiResponse<JastipRequest>>('/v1/jastip/requests', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.requests() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myRequests() });
    },
  });
}

export function useUpdateJastipRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreateJastipRequestPayload>) => {
      const { data } = await api.put<ApiResponse<JastipRequest>>(`/v1/jastip/requests/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.requests() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.requestDetail(id) });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myRequests() });
    },
  });
}

export function useDeleteJastipRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/jastip/requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jastipKeys.requests() });
      queryClient.invalidateQueries({ queryKey: jastipKeys.myRequests() });
    },
  });
}
