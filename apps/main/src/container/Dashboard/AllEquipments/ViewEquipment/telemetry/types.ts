// Shared shapes for the mock telemetry engine. Everything is derived, deterministic
// per device id (no backend) — the same model the warranty and device-status mocks use.

// Compliance checks are tri-state on purpose (PRD hard requirement): an unknown signal
// must read as "not yet verified", never as a silent pass or an absent badge.
export type TriState = "pass" | "fail" | "not_verified";

export type Ownership = "company" | "employee";

export type OsName = "macOS" | "Windows" | "iOS" | "Android";

// How recently an application was actually launched. "unused" is the licence reclamation
// signal: installed, still licensed, not opened in two months.
export type AppUsage = "active" | "occasional" | "unused";

export interface SoftwareItem {
  name: string;
  version: string;
  // Chrome-installed web apps are tagged so the inventory separates them from native software.
  isPwa: boolean;
  installedLabel: string;
  lastRunLabel: string;
  usage: AppUsage;
}

// Averaged over the sampling window rather than read at one check-in. A snapshot of
// running processes goes stale between syncs; the average is what holds still.
export interface MemoryConsumer {
  name: string;
  avgGb: number;
  runningNow: boolean;
}

export interface ComplianceChecks {
  encryption: TriState;
  firewall: TriState;
  antivirus: TriState;
  screenLock: TriState;
  osPatch: TriState;
}

// An update that is downloaded but waiting on a restart is not the same as one that has
// not been fetched. The fix is only live after the restart, so the two read differently.
// `restart_overdue` is `restart_required` that has been ignored. The distinction matters:
// the two-day threshold for "waiting on a restart" is the fleet median itself, so almost
// any pending update trips it, and without an escalation a device a month behind looks
// identical to one three days behind.
export type UpdateState =
  | "current"
  | "restart_required"
  | "restart_overdue"
  | "available"
  | "unknown";

export interface UpdateStatus {
  latestOsVersion: string;
  state: UpdateState;
  downloadedOnLabel: string | null;
  pendingRestartDays: number | null;
  lastRestartLabel: string;
  uptimeLabel: string;
  fleetMedianRestartDays: number;
  // Restart age is its own axis, so the badge can correctly read "update available" on a
  // device that has not restarted in a month without that second fact going unsaid.
  restartAgeOverdue: boolean;
}

// Trends stay hidden until the agent has sampled for long enough to draw
// one honestly. Progressive disclosure, the way an analytics tool holds back a report.
export interface SampleWindow {
  days: number;
  need: number;
  ready: boolean;
  unlockLabel: string;
  sinceLabel: string;
}

export interface AgentTelemetry {
  agentInstalled: boolean;
  agentVersion: string;
  agentUpToDate: boolean;
  lastSyncedLabel: string; // exact — "Jun 23, 2026, 2:14 PM"
  lastSyncedRelative: string; // "11 minutes ago", shown beside the exact stamp
  firstSeenLabel: string; // when the agent first checked in from this device
  daysSinceSync: number;
  isStale: boolean; // no check-in beyond the 7-day window: show as stale, never last-known-good
  os: { name: OsName; version: string; build: string };
  // `downloadedDaysAgo` is null when an update exists but is not on disk yet. One field
  // carries both facts, so there is no way to be downloaded without a date.
  patch: {
    status: TriState;
    pendingUpdates: number;
    lastRebootDays: number;
    downloadedDaysAgo: number | null;
  };
  update: UpdateStatus;
  battery: {
    percent: number;
    health: string;
    cycleCount: number;
    ratedCycles: number;
    maxCapacityPct: number;
    charging: boolean;
  };
  storage: { totalGb: number; freeGb: number; encrypted: TriState };
  memory: {
    totalGb: number;
    pressureAvgPct: number;
    consumers: MemoryConsumer[];
  };
  compliance: ComplianceChecks;
  identity: { hostname: string; loggedInUser: string; serial: string };
  software: SoftwareItem[];
  history: SampleWindow;
  liveHistory?: import("./complianceHistory").CheckHistory[];
}

// Per-device seed values (PRD sample fleet). Sync recency comes from getDeviceTelemetry,
// so seeds carry only what the agent would report about the device itself.
export interface TelemetrySeed {
  agentInstalled: boolean;
  agentVersion: string;
  os: { name: OsName; version: string; build: string };
  // `downloadedDaysAgo` is null when an update exists but is not on disk yet. One field
  // carries both facts, so there is no way to be downloaded without a date.
  patch: {
    status: TriState;
    pendingUpdates: number;
    lastRebootDays: number;
    downloadedDaysAgo: number | null;
  };
  battery: {
    percent: number;
    health: string;
    cycleCount: number;
    ratedCycles: number;
    maxCapacityPct: number;
    charging: boolean;
  };
  storage: { totalGb: number; freeGb: number };
  compliance: ComplianceChecks;
}

// Fixture overrides for previewing every Telemetry tab scenario on the detail page.
export type AgentOverride =
  | "default"
  | "installed"
  | "not_installed"
  | "stale"
  | "outdated"
  | "revoked";
export type HealthOverride = "default" | "healthy" | "attention" | "critical";
export type TrendOverride = "default" | "collecting" | "ready";
export type UpdateOverride =
  | "default"
  | "current"
  | "available"
  | "available_stale_restart"
  | "restart_required"
  | "restart_overdue";

export interface TelemetryOverrides {
  agent?: AgentOverride;
  health?: HealthOverride;
  trend?: TrendOverride;
  update?: UpdateOverride;
}
