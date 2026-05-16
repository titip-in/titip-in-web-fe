/**
 * Formats a date to a short "time ago" string like "16m lalu", "3j lalu", etc.
 */
export function formatTimeAgoShort(date: Date | string | number): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "baru saja";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}j lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}h lalu`;
  }

  // Fallback to local date string for older dates
  return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
