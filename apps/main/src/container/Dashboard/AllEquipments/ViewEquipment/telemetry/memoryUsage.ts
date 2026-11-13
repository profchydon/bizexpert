import { seedFor } from "./historyWindow";
import type { MemoryConsumer } from "./types";

// Which applications hold memory changes between check-ins, so a snapshot list would go
// stale the moment it rendered. The running dot is the snapshot; the average footprint
// over the last week is the stable signal, and the ranking is built on the average.
const CANDIDATES: { name: string; weight: number }[] = [
  { name: "Google Chrome", weight: 34 },
  { name: "Slack", weight: 18 },
  { name: "Microsoft Teams", weight: 14 },
  { name: "System processes", weight: 9 },
  { name: "Visual Studio Code", weight: 8 },
  { name: "Zoom Workplace", weight: 7 },
  { name: "Docker Desktop", weight: 12 },
  { name: "Spotify", weight: 4 },
];

export interface MemoryUsage {
  totalGb: number;
  pressureAvgPct: number;
  consumers: MemoryConsumer[];
}

export function getMemoryUsage(id: string): MemoryUsage {
  const s = seedFor(id, "memory");
  const totalGb = [8, 16, 16, 32][s % 4];
  // Pressure is the share of installed memory in use, averaged over the window.
  const pressureAvgPct = 52 + (s % 36);
  const inUse = (totalGb * pressureAvgPct) / 100;

  const picked = CANDIDATES.filter((_, i) => (s + i) % 8 !== 3).slice(0, 6);
  const weightTotal = picked.reduce((a, c) => a + c.weight, 0);
  const consumers = picked
    .map((c, i) => ({
      name: c.name,
      avgGb:
        Math.round(((c.weight / weightTotal) * inUse + Number.EPSILON) * 10) /
        10,
      // Everything but the lightest tail was running at the last check-in.
      runningNow: i < picked.length - 1 || (s + i) % 3 !== 0,
    }))
    .sort((a, b) => b.avgGb - a.avgGb);

  return { totalGb, pressureAvgPct, consumers };
}

// The line under the list. Naming the two biggest holders turns a ranking into a decision:
// tab hygiene on those two may buy back more headroom than a RAM upgrade.
export function memorySummary(usage: MemoryUsage): string {
  const [first, second] = usage.consumers;
  if (!first || !second)
    return "Averaged over the last 7 days while each application was running.";
  const share = Math.round(
    ((first.avgGb + second.avgGb) / usage.totalGb) * 100,
  );
  return `${first.name} and ${second.name} together account for ${share}% of installed memory. That is what puts the pressure reading where it is.`;
}
