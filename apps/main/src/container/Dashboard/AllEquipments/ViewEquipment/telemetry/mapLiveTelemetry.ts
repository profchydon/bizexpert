import type { TelemetryDevice, TelemetrySnapshot } from "@/types/telemetry";
import { HISTORY_DAYS, dayLabel } from "./historyWindow";
import type { CheckHistory } from "./complianceHistory";
import { CHECK_ORDER } from "./signalCopy";
import { SAMPLES_NEEDED } from "./sampleWindow";
import type {
  AgentTelemetry,
  AppUsage,
  ComplianceChecks,
  MemoryConsumer,
  OsName,
  SoftwareItem,
  TriState,
  UpdateStatus,
} from "./types";

export const LATEST_AGENT_VERSION = "2.4.1";
const STALE_AFTER_DAYS = 7;
const FLEET_MEDIAN_RESTART_DAYS = 2;
const RESTART_OVERDUE_DAYS = 14;

const CHECK_MAP: Record<string, keyof ComplianceChecks> = {
  disk_encryption: "encryption",
  firewall: "firewall",
  antivirus: "antivirus",
  screen_lock: "screenLock",
};

export function mapLiveTelemetry(
  device: TelemetryDevice,
): AgentTelemetry | null {
  const snapshot = device.telemetry;
  const agentInstalled = Boolean(device.agent) && !device.flags.no_agent;
  const collectedAt =
    snapshot?.collected_at ?? device.agent?.last_seen_at ?? null;
  const daysSinceSync = daysSince(collectedAt);
  const agentVersion = snapshot?.agent_version ?? "";
  const os = mapOs(snapshot);
  const compliance = mapCompliance(snapshot);
  const storage = mapStorage(snapshot, compliance.encryption);
  const battery = mapBattery(snapshot);
  const memory = mapMemory(snapshot);
  const patch = mapPatch(snapshot);
  const samples = device.metric_sample_count ?? 0;

  return {
    agentInstalled,
    agentVersion,
    agentUpToDate:
      Boolean(agentVersion) && agentVersion === LATEST_AGENT_VERSION,
    lastSyncedLabel: collectedAt ? formatExact(collectedAt) : "",
    lastSyncedRelative: collectedAt ? relativeLabel(daysSinceSync) : "",
    firstSeenLabel: "",
    daysSinceSync,
    isStale:
      agentInstalled &&
      (device.flags.stale || daysSinceSync > STALE_AFTER_DAYS),
    os,
    patch,
    update: mapUpdate(os, patch, snapshot),
    battery,
    storage,
    memory,
    compliance,
    identity: {
      hostname: snapshot?.hostname ?? "",
      loggedInUser: device.assignee_contact?.email ?? "",
      serial: device.serial_number ?? snapshot?.serial_number ?? "",
    },
    software: agentInstalled ? mapSoftware(snapshot) : [],
    history: {
      days: Math.min(samples, SAMPLES_NEEDED),
      need: SAMPLES_NEEDED,
      ready: samples >= SAMPLES_NEEDED,
      unlockLabel: dayLabel(
        -(SAMPLES_NEEDED - Math.min(samples, SAMPLES_NEEDED)),
      ),
      sinceLabel:
        samples > 0 ? dayLabel(Math.min(samples, SAMPLES_NEEDED)) : "",
    },
    liveHistory: mapLiveHistory(device),
  };
}

export function mapLiveHistory(
  device: TelemetryDevice,
): CheckHistory[] | undefined {
  const checks = device.compliance_history?.checks;
  if (!checks?.length) return undefined;

  return CHECK_ORDER.map((key) => {
    const match = checks.find((item) => item.key === key);
    const days = padDays(match?.days ?? []);
    const current = (match?.current as TriState | undefined) ?? "not_verified";
    return {
      key,
      days,
      current,
      changedDaysAgo: changedDaysAgo(days, current),
    };
  });
}

function padDays(days: CheckHistory["days"]): CheckHistory["days"] {
  if (days.length >= HISTORY_DAYS) return days.slice(-HISTORY_DAYS);
  return [
    ...Array(HISTORY_DAYS - days.length).fill("no_data"),
    ...days,
  ] as CheckHistory["days"];
}

function changedDaysAgo(
  days: CheckHistory["days"],
  current: TriState,
): number | null {
  if (current !== "fail") return null;
  let held = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i] === "fail") held += 1;
    else if (days[i] !== "no_data") break;
  }
  return held > 0 ? held - 1 : null;
}

function mapCompliance(
  snapshot: TelemetrySnapshot | null | undefined,
): ComplianceChecks {
  const results = snapshot?.compliance_results ?? [];
  const mapped: ComplianceChecks = {
    encryption: "not_verified",
    firewall: "not_verified",
    antivirus: "not_verified",
    screenLock: "not_verified",
    osPatch: mapOsPatch(snapshot?.os_update),
  };

  for (const result of results) {
    const key = CHECK_MAP[result.check_id];
    if (key) mapped[key] = toTriState(result.status);
  }

  if (
    mapped.encryption === "not_verified" &&
    typeof snapshot?.disk_encrypted === "boolean"
  ) {
    mapped.encryption = snapshot.disk_encrypted ? "pass" : "fail";
  }

  return mapped;
}

function mapOsPatch(osUpdate: TelemetrySnapshot["os_update"]): TriState {
  if (!osUpdate?.status) return "not_verified";
  if (osUpdate.status === "up_to_date") return "pass";
  if (
    osUpdate.status === "updates_available" ||
    osUpdate.status === "restart_required"
  ) {
    return "fail";
  }
  return "not_verified";
}

function toTriState(status: string | undefined): TriState {
  if (status === "pass" || status === "fail") return status;
  return "not_verified";
}

function mapOs(
  snapshot: TelemetrySnapshot | null | undefined,
): AgentTelemetry["os"] {
  const name = normalizeOs(snapshot?.os_name);
  return {
    name,
    version: snapshot?.os_version ?? "",
    build: snapshot?.os_build ?? "",
  };
}

function normalizeOs(name: string | null | undefined): OsName {
  const value = (name ?? "").toLowerCase();
  if (value.includes("win")) return "Windows";
  if (
    value.includes("ios") ||
    value.includes("ipad") ||
    value.includes("iphone")
  )
    return "iOS";
  if (value.includes("android")) return "Android";
  return "macOS";
}

function mapStorage(
  snapshot: TelemetrySnapshot | null | undefined,
  encrypted: TriState,
): AgentTelemetry["storage"] {
  const totalGb = bytesToGb(snapshot?.disk_total_bytes);
  const freeGb = bytesToGb(snapshot?.disk_free_bytes);
  return { totalGb, freeGb, encrypted };
}

function mapBattery(
  snapshot: TelemetrySnapshot | null | undefined,
): AgentTelemetry["battery"] {
  const rawCapacity = Number(snapshot?.battery_max_capacity_percent);
  return {
    percent: Number(snapshot?.battery_percent ?? 0),
    health: snapshot?.battery_condition || "Unknown",
    cycleCount: Number(snapshot?.battery_cycle_count ?? 0),
    ratedCycles: 1000,
    maxCapacityPct:
      Number.isFinite(rawCapacity) && rawCapacity > 0 ? rawCapacity : 0,
    charging: (snapshot?.battery_charging_status ?? "")
      .toLowerCase()
      .includes("charg"),
  };
}

function mapMemory(
  snapshot: TelemetrySnapshot | null | undefined,
): AgentTelemetry["memory"] {
  const totalGb =
    bytesToGb(snapshot?.ram_bytes) || parseMemoryGb(snapshot?.total_memory);
  const consumers = mapConsumers(snapshot?.running_activity);
  return {
    totalGb,
    pressureAvgPct: Number(snapshot?.memory_percent ?? 0),
    consumers,
  };
}

function mapConsumers(
  activity: TelemetrySnapshot["running_activity"],
): MemoryConsumer[] {
  const groups = Array.isArray(activity?.groups) ? activity.groups : [];
  return groups
    .map((group) => ({
      name: String(group.name ?? "Unknown"),
      avgGb: bytesToGb(Number(group.memory_bytes ?? 0)),
      runningNow: Number(group.instance_count ?? 0) > 0,
    }))
    .filter((item) => item.name)
    .sort((a, b) => b.avgGb - a.avgGb)
    .slice(0, 8);
}

function mapSoftware(
  snapshot: TelemetrySnapshot | null | undefined,
): SoftwareItem[] {
  const items = snapshot?.installed_software ?? [];
  return items.map((item) => ({
    name: String(item.name ?? item.display_name ?? "Unknown"),
    version: String(item.version ?? ""),
    isPwa: Boolean(item.is_pwa ?? item.isPwa),
    installedLabel: String(item.installed_at ?? item.installedLabel ?? ""),
    lastRunLabel: String(item.last_opened_at ?? item.lastRunLabel ?? ""),
    usage: (item.usage as AppUsage | undefined) ?? "occasional",
  }));
}

function mapPatch(
  snapshot: TelemetrySnapshot | null | undefined,
): AgentTelemetry["patch"] {
  const pending = Number(snapshot?.os_update?.pending_update_count ?? 0);
  const lastRebootDays = daysSince(
    snapshot?.last_restart_at ?? snapshot?.last_boot_up_time ?? null,
  );
  return {
    status: mapOsPatch(snapshot?.os_update),
    pendingUpdates: pending,
    lastRebootDays,
    downloadedDaysAgo: pending > 0 ? lastRebootDays : null,
  };
}

function mapUpdate(
  os: AgentTelemetry["os"],
  patch: AgentTelemetry["patch"],
  snapshot: TelemetrySnapshot | null | undefined,
): UpdateStatus {
  const pending = patch.pendingUpdates > 0;
  const downloaded = pending && patch.downloadedDaysAgo !== null;
  const pendingRestartDays = downloaded ? patch.downloadedDaysAgo : null;
  const overdue =
    pendingRestartDays !== null && pendingRestartDays >= RESTART_OVERDUE_DAYS;
  const line = `${os.name} ${os.version.split(" ")[0]}`.trim();
  const latest =
    snapshot?.os_update?.latest_available_version ||
    `${line} ${os.build}`.trim();
  const uptimeSeconds = Number(snapshot?.uptime_seconds ?? 0);

  return {
    latestOsVersion: latest || line,
    state: !pending
      ? "current"
      : !downloaded
        ? "available"
        : overdue
          ? "restart_overdue"
          : "restart_required",
    downloadedOnLabel: downloaded
      ? dayLabel(patch.downloadedDaysAgo as number)
      : null,
    pendingRestartDays,
    lastRestartLabel: snapshot?.last_restart_at
      ? formatExact(snapshot.last_restart_at)
      : dayLabel(patch.lastRebootDays),
    uptimeLabel: formatUptime(uptimeSeconds, patch.lastRebootDays),
    fleetMedianRestartDays: FLEET_MEDIAN_RESTART_DAYS,
    restartAgeOverdue: patch.lastRebootDays >= RESTART_OVERDUE_DAYS,
  };
}

function formatUptime(seconds: number, fallbackDays: number): string {
  if (seconds > 0) {
    const days = Math.floor(seconds / 86_400);
    const hours = Math.floor((seconds % 86_400) / 3600);
    return days === 0 ? `${hours}h` : `${days}d ${hours}h`;
  }
  return fallbackDays === 0 ? "0h" : `${fallbackDays}d`;
}

function bytesToGb(bytes: number | null | undefined): number {
  const value = Number(bytes ?? 0);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round((value / 1024 ** 3) * 10) / 10;
}

function parseMemoryGb(raw: string | null | undefined): number {
  const match = String(raw ?? "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function daysSince(iso: string | null): number {
  if (!iso) return 0;
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return 0;
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

function formatExact(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function relativeLabel(days: number): string {
  if (days > 1) return `${days} days ago`;
  if (days === 1) return "yesterday";
  return "just now";
}
