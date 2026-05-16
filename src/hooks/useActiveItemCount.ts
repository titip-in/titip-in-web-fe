import { useMyJastipListings, useMyJastipRequests } from './useJastip';
import { useMyPrelovedListings, useMyPrelovedRequests } from './usePreloved';

const ACTIVE_LIMIT = 5;

/** Returns active-item counts and whether each category has hit the limit. */
export function useActiveItemCount() {
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
  };
}
