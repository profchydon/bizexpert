import type { Disposition } from "@/types/offboard";
import type { DeviceLine } from "@/types/offboard";
import { applyDispositionToLine } from "./offboardPricing";

const INTENT_KEY = "offboard-employee:intent";

export interface OffboardIntent {
  employeeId: string;
  deviceIds: string[];
  disposition: Disposition;
}

export function startOffboardWithDisposition(intent: OffboardIntent) {
  if (typeof globalThis.sessionStorage === "undefined") return;
  try {
    globalThis.sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  } catch {
    return;
  }
}

export function consumeOffboardIntent(
  employeeId: string,
): OffboardIntent | null {
  if (typeof globalThis.sessionStorage === "undefined") return null;
  try {
    const raw = globalThis.sessionStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw) as OffboardIntent;
    if (String(intent.employeeId) !== String(employeeId)) return null;
    globalThis.sessionStorage.removeItem(INTENT_KEY);
    return intent;
  } catch {
    return null;
  }
}

export function applyOffboardIntentToLines(
  lines: DeviceLine[],
  intent: OffboardIntent,
): { lines: DeviceLine[]; selection: string[] } {
  const targets = new Set(intent.deviceIds.map(String));
  const matched = lines.filter((line) =>
    targets.has(String(line.equipmentId ?? "")),
  );
  const nextLines = matched.map((line) =>
    applyDispositionToLine(line, intent.disposition),
  );

  return {
    lines: nextLines,
    selection: nextLines.map((line) => line.id),
  };
}
