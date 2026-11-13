// How far back every telemetry history reads. Shared by the battery series and the
// compliance bars so the two line up day for day.
export const HISTORY_DAYS = 30;

const DAY_MS = 86_400_000;

export function dayLabel(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY_MS).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Install dates reach more than a year back, so a bare "Nov 29" sitting beside a relative
// "71 days ago" cannot be resolved to a year by the reader. Anything that can cross a year
// boundary uses this instead of dayLabel.
export function dateLabel(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY_MS).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Full timestamp in the activity feed's format ("Aug 3, 2026, 9:14 AM"). The clock time is
// derived from the seed so an event keeps the same time between renders.
export function dayTimeLabel(daysAgo: number, seed: number): string {
  const d = new Date(Date.now() - daysAgo * DAY_MS);
  d.setHours(8 + (seed % 10), (seed * 7) % 60, 0, 0);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Deterministic per device and per signal, so a device's history never reshuffles
// between renders.
export function seedFor(id: string, key: string): number {
  let h = Number(id) || id.length;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 997;
  return h;
}

// "1 days" reads as a bug. Used anywhere a day count is rendered.
export function dayCount(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}
