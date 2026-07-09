function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** UTC day bucket, e.g. "2026-07-09". */
export function dayBucket(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

/** UTC hour bucket, e.g. "2026-07-09T14". */
export function hourBucket(date: Date): string {
  return `${dayBucket(date)}T${pad(date.getUTCHours())}`
}

export function secondsUntilNextHour(date: Date): number {
  return 3600 - (date.getUTCMinutes() * 60 + date.getUTCSeconds())
}

export function secondsUntilNextUtcDay(date: Date): number {
  return 86400 - (date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds())
}

/** The last `count` UTC day buckets, most recent first (including today). */
export function recentDayBuckets(date: Date, count: number): string[] {
  const days: string[] = []
  for (let i = 0; i < count; i++) {
    days.push(dayBucket(new Date(date.getTime() - i * 86400000)))
  }
  return days
}
