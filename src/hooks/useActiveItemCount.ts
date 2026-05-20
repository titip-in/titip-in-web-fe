import { useMyJastipListings, useMyJastipRequests } from './useJastip';
import { useMyPrelovedListings, useMyPrelovedRequests } from './usePreloved';
import { useAuthStore } from '@/stores/authStore';
import { TIER_LIMITS } from '@/types/api';

/** Returns active-item counts and whether each category has hit the limit (tier-based). */
export function useActiveItemCount() {
  const user = useAuthStore((s) => s.user);
  const tier = user?.tier ?? 'basic';
  const ACTIVE_LIMIT = TIER_LIMITS[tier];

  const { data: myJastipListings } = useMyJastipListings();
  const { data: myJastipRequests } = useMyJastipRequests();
  const { data: myPrelovedListings } = useMyPrelovedListings();
  const { data: myPrelovedRequests } = useMyPrelovedRequests();

  const jastipListingActiveCount = (myJastipListings ?? []).filter(
    (l) => l.status === 'ACTIVE'
  ).length;

  const jastipRequestActiveCount = (myJastipRequests ?? []).filter(
    (r) => r.status === 'OPEN'
  ).length;

  const prelovedListingActiveCount = (myPrelovedListings ?? []).filter(
    (l) => l.status === 'AVAILABLE'
  ).length;

  const prelovedRequestActiveCount = (myPrelovedRequests ?? []).filter(
    (r) => r.status === 'OPEN'
  ).length;

  return {
    jastipListingActiveCount,
    jastipRequestActiveCount,
    prelovedListingActiveCount,
    prelovedRequestActiveCount,
    isJastipListingLimitReached: jastipListingActiveCount >= ACTIVE_LIMIT,
    isJastipRequestLimitReached: jastipRequestActiveCount >= ACTIVE_LIMIT,
    isPrelovedListingLimitReached: prelovedListingActiveCount >= ACTIVE_LIMIT,
    isPrelovedRequestLimitReached: prelovedRequestActiveCount >= ACTIVE_LIMIT,
    ACTIVE_LIMIT,
    tier,
  };
}
