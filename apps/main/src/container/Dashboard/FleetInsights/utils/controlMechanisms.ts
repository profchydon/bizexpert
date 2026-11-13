import type { FleetControlItem } from "@/types/telemetry";
import { normalizeControlKey } from "./fleetFilters";

export const FLEET_CONTROL_KEYS = [
  "encryption",
  "firewall",
  "antivirus",
  "screen_lock",
] as const;

export type FleetControlKey = (typeof FLEET_CONTROL_KEYS)[number];

export const PHONE_OS = new Set(["ios", "android", "iphone", "ipad"]);

export function isPhoneOs(osName?: string | null): boolean {
  if (!osName) return false;
  const normalized = osName.toLowerCase();
  return [...PHONE_OS].some((phone) => normalized.includes(phone));
}

export function controlAppliesToDevice(
  controlKey: FleetControlKey,
  osName?: string | null,
): boolean {
  if (!isPhoneOs(osName)) return true;
  return controlKey === "encryption" || controlKey === "screen_lock";
}

export function resolveControlLabel(key: FleetControlKey): string {
  if (key === "encryption") return "Encryption";
  if (key === "firewall") return "Firewall";
  if (key === "antivirus") return "Antivirus";
  return "Screen lock";
}

export function resolveControlMechanism(
  controlKey: FleetControlKey,
  platform?: string,
): string {
  const normalized = platform?.toLowerCase() ?? "";
  if (controlKey === "encryption") {
    if (normalized.includes("win")) return "BitLocker";
    if (normalized.includes("mac")) return "FileVault";
    return "Disk encryption";
  }
  if (controlKey === "firewall") return "Firewall";
  if (controlKey === "antivirus") return "Antivirus";
  return "Screen lock";
}

export function findControlItem(
  controls: FleetControlItem[],
  key: FleetControlKey,
): FleetControlItem | undefined {
  return controls.find((control) => {
    const raw = control.key ?? control.check_id ?? "";
    const normalized = normalizeControlKey(raw);
    if (key === "encryption") {
      return normalized.includes("encrypt");
    }
    if (key === "screen_lock") {
      return normalized.includes("screen");
    }
    return normalized.includes(key);
  });
}

export function controlPassSummary(item?: FleetControlItem): string {
  if (!item) return "Not collected";
  const pass = item.pass_count ?? 0;
  const fail = item.fail_count ?? 0;
  const unknown = item.unknown_count ?? 0;
  const total = pass + fail + unknown;
  if (total === 0) return "Not collected";
  const rate = item.pass_rate ?? (pass / total) * 100;
  return `${pass} of ${total} · ${Math.round(rate)}%`;
}

export function controlTrendLabel(item?: FleetControlItem): string {
  const direction = item?.trend?.direction ?? "steady";
  const delta = item?.trend?.points_delta;
  if (direction === "up") {
    return delta != null ? `Up ${Math.abs(delta)} pts` : "Up";
  }
  if (direction === "down") {
    return delta != null ? `Down ${Math.abs(delta)} pts` : "Down";
  }
  return "Steady";
}
