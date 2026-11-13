import { LOW_CAPACITY_PCT, LOW_STORAGE_GB } from "./deviceHealth";
import { dayLabel } from "./historyWindow";
import type { AgentTelemetry } from "./types";

export type ReadingTone = "bad" | "warn" | "neutral";

export interface Reading {
  key: "battery" | "storage" | "memory";
  label: string;
  value: string;
  unit: string;
  sub: string;
  tone: ReadingTone;
  series: number[]; // oldest first, ending on the current value
  fromLabel: string;
  toLabel: string;
  delta: string;
}

function lastValueSeries(value: number): number[] {
  return [value];
}

function batteryReading(t: AgentTelemetry, window: number): Reading {
  const { battery } = t;
  return {
    key: "battery",
    label: "Battery capacity",
    value: String(battery.maxCapacityPct),
    unit: "%",
    sub: `${battery.cycleCount.toLocaleString()} of ${battery.ratedCycles.toLocaleString()} rated cycles used.`,
    tone:
      battery.maxCapacityPct > 0 && battery.maxCapacityPct < LOW_CAPACITY_PCT
        ? "warn"
        : "neutral",
    series: lastValueSeries(battery.maxCapacityPct),
    fromLabel: `${dayLabel(window)} · ${battery.maxCapacityPct}%`,
    toLabel: `${dayLabel(0)} · ${battery.maxCapacityPct}%`,
    delta: "0 pts",
  };
}

function storageReading(t: AgentTelemetry, window: number): Reading {
  const used = t.storage.totalGb - t.storage.freeGb;
  return {
    key: "storage",
    label: "Storage used",
    value: String(used),
    unit: "GB",
    sub: `${t.storage.freeGb} GB free of ${t.storage.totalGb} GB.`,
    tone:
      t.storage.totalGb > 0 && t.storage.freeGb < LOW_STORAGE_GB
        ? "bad"
        : "neutral",
    series: lastValueSeries(used),
    fromLabel: `${dayLabel(window)} · ${used} GB`,
    toLabel: `${dayLabel(0)} · ${used} GB`,
    delta: "0 GB",
  };
}

function memoryReading(
  t: AgentTelemetry,
  window: number,
  reduced: boolean,
): Reading {
  const now = t.memory.pressureAvgPct;
  return {
    key: "memory",
    label: "Memory pressure",
    value: String(now),
    unit: "%",
    sub: reduced
      ? `Average while running. Aggregate only on a personal device, never per application.`
      : `Average while running, of ${t.memory.totalGb} GB installed.`,
    tone: now >= 80 ? "warn" : "neutral",
    series: lastValueSeries(now),
    fromLabel: `${dayLabel(window)} · ${now}%`,
    toLabel: `${dayLabel(0)} · ${now}%`,
    delta: "0 pts",
  };
}

// Company devices show all three. Personal devices show aggregate memory pressure only:
// battery is the employee's own hardware and disk usage is their own content.
export function getReadings(t: AgentTelemetry, reduced = false): Reading[] {
  const window = t.history.days;
  if (reduced) return [memoryReading(t, window, true)];
  return [
    batteryReading(t, window),
    storageReading(t, window),
    memoryReading(t, window, false),
  ];
}
