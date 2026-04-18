import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Parse `YYYY-MM-DD` as a local calendar date (avoids UTC day shifts). */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Week span labels:
 * - Same month/year: `1 - 5 January 2026`
 * - Same year, different months: `28 January - 2 February 2026`
 * - Different years: `2 February 2025 - 1 January 2026`
 */
export function formatWeekDateRange(startDateStr: string, endDateStr: string): string {
  const start = parseLocalDate(startDateStr)
  const end = parseLocalDate(endDateStr)
  const sd = start.getDate()
  const ed = end.getDate()
  const sm = start.getMonth()
  const em = end.getMonth()
  const sy = start.getFullYear()
  const ey = end.getFullYear()

  const monthLong = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "long" })

  if (sy === ey && sm === em) {
    return `${sd} - ${ed} ${monthLong(start)} ${sy}`
  }

  if (sy === ey) {
    return `${sd} ${monthLong(start)} - ${ed} ${monthLong(end)} ${sy}`
  }

  return `${sd} ${monthLong(start)} ${sy} - ${ed} ${monthLong(end)} ${ey}`
}

export function getDateRangeBounds(
  range: string
): { from: Date; to: Date } | null {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  if (range === 'this_week') {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: monday, to: sunday };
  }

  if (range === 'last_week') {
    const lastMonday = new Date(monday);
    lastMonday.setDate(monday.getDate() - 7);
    const lastSunday = new Date(monday);
    lastSunday.setDate(monday.getDate() - 1);
    return { from: lastMonday, to: lastSunday };
  }

  if (range === 'this_month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from, to };
  }

  return null;
}
