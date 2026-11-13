import {
  CHECK_FAILURE,
  CHECK_ORDER,
  CHECK_UNVERIFIED,
  type CheckKey,
} from "./signalCopy";
import type { AgentTelemetry } from "./types";

export const LOW_STORAGE_GB = 20;
// Maximum capacity against the original design. This is what wear actually means, and
// below 80 percent a cell is normally considered consumed.
export const LOW_CAPACITY_PCT = 80;

export type HealthTone = "healthy" | "minor" | "attention";

export interface HealthIssue {
  key: CheckKey;
  tone: "fail" | "unverified";
  title: string;
  detail: string;
}

export type HardwareKey = "storage" | "battery";

// The verdict names the worn battery and the full disk, so they need somewhere to go. They
// are not compliance checks: nothing about them can be nudged into passing, and a reminder
// schedule would be the wrong shape. They carry their own actions instead.
export interface HardwareIssue {
  key: HardwareKey;
  tone: "fail" | "warn";
  title: string;
  detail: string;
  action: "email" | "replace";
}

export interface DeviceHealth {
  score: number; // 0 to 100
  tone: HealthTone;
  headline: string;
  summary: string;
  issues: HealthIssue[]; // compliance checks, which have reminder schedules
  hardwareIssues: HardwareIssue[]; // battery and disk, which do not
  passingCount: number; // of CHECK_ORDER, so the verdict band's ratio stays a compliance ratio
  batteryWorn: boolean;
  lowStorage: boolean;
}

// Penalties are weighted by how much each signal actually matters to an admin: a failing
// check costs more than an unconfirmed one, and a stale agent discounts the whole reading.
const FAIL = 15;
const UNVERIFIED = 7;
const BATTERY = 8;
const STORAGE = 10;
const STALE = 8;

function joinClauses(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

// `complianceOnly` scores a personal device. Battery and storage penalties there would be
// scoring hardware the company does not own and does not collect.
export function getDeviceHealth(
  t: AgentTelemetry,
  complianceOnly = false,
): DeviceHealth {
  const issues: HealthIssue[] = [];
  let score = 100;

  for (const key of CHECK_ORDER) {
    const state = t.compliance[key];
    if (state === "fail") {
      score -= FAIL;
      issues.push({ key, tone: "fail", ...CHECK_FAILURE[key] });
    } else if (state === "not_verified") {
      score -= UNVERIFIED;
      issues.push({ key, tone: "unverified", ...CHECK_UNVERIFIED[key] });
    }
  }

  // Wear, not charge. This read `battery.percent < 45` while the summary it fed said "the
  // battery is worn", so a healthy cell at a low charge reported as worn. Maximum capacity
  // against the original design is what wear actually means, which the constants already said.
  const batteryWorn =
    !complianceOnly &&
    t.battery.maxCapacityPct > 0 &&
    t.battery.maxCapacityPct < LOW_CAPACITY_PCT;
  const lowStorage =
    !complianceOnly &&
    t.storage.totalGb > 0 &&
    t.storage.freeGb < LOW_STORAGE_GB;
  if (batteryWorn) score -= BATTERY;
  if (lowStorage) score -= STORAGE;

  const hardwareIssues = buildHardwareIssues(t, batteryWorn, lowStorage);
  if (t.isStale) score -= STALE;
  score = Math.max(0, Math.min(100, score));

  const failing = issues.filter((i) => i.tone === "fail").length;
  const unconfirmed = issues.length - failing;
  const tone: HealthTone =
    score >= 90 ? "healthy" : score >= 70 ? "minor" : "attention";

  const clauses: string[] = [];
  if (failing > 0)
    clauses.push(
      `${failing} ${failing === 1 ? "check is failing" : "checks are failing"}`,
    );
  if (unconfirmed > 0)
    clauses.push(
      `${unconfirmed} ${unconfirmed === 1 ? "is unconfirmed" : "are unconfirmed"}`,
    );
  if (lowStorage) clauses.push("the disk is nearly full");
  if (batteryWorn) clauses.push("the battery is worn");

  const stale = t.isStale
    ? ` Last sync was ${t.daysSinceSync} days ago, so everything below is a snapshot, not a live reading.`
    : "";
  const summary =
    clauses.length > 0
      ? `${capitalize(joinClauses(clauses))}.${stale}`
      : `Every check passed on the last sync.${stale}`;

  return {
    score,
    tone,
    headline: complianceOnly
      ? tone === "healthy"
        ? "Compliance is clean"
        : "Compliance needs attention"
      : tone === "healthy"
        ? "This device is healthy"
        : tone === "minor"
          ? "This device has minor issues"
          : "This device needs attention",
    summary,
    issues,
    hardwareIssues,
    passingCount: CHECK_ORDER.length - issues.length,
    batteryWorn,
    lowStorage,
  };
}

function buildHardwareIssues(
  t: AgentTelemetry,
  batteryWorn: boolean,
  lowStorage: boolean,
): HardwareIssue[] {
  const out: HardwareIssue[] = [];
  if (lowStorage) {
    out.push({
      key: "storage",
      tone: "fail",
      title: "Disk is nearly full",
      detail: `${t.storage.freeGb} GB free of ${t.storage.totalGb} GB. Rayda cannot clear space remotely, so this one needs the person holding the device.`,
      action: "email",
    });
  }
  if (batteryWorn) {
    out.push({
      key: "battery",
      tone: "warn",
      title: "Battery is worn",
      detail: `${t.battery.cycleCount.toLocaleString()} of ${t.battery.ratedCycles.toLocaleString()} rated cycles used, at ${t.battery.maxCapacityPct}% of original capacity. Replacing it is a procurement decision, not a device setting.`,
      action: "replace",
    });
  }
  return out;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
