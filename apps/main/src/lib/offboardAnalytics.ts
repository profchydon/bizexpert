import { resolveAssetTypeName } from "@/container/Dashboard/Employees/OffboardDevices/resolveAssetTypeName";
import { track } from "@/lib/analytics";
import type { ActionType } from "@/types/offboarding";
import type { DeviceLine, Disposition } from "@/types/offboard";

export type OffboardAnalyticsDisposition =
  | "storage"
  | "buy_to_storage"
  | "archive";

export function mapDispositionToAnalytics(
  disposition: Disposition,
): OffboardAnalyticsDisposition | null {
  if (disposition === "STORE") return "storage";
  if (disposition === "DISPOSE") return "archive";
  return null;
}

export function mapActionTypeToAnalytics(
  actionType?: ActionType,
): OffboardAnalyticsDisposition | null {
  if (actionType === "Store") return "storage";
  if (actionType === "Archive") return "archive";
  if (actionType === "Sale") return "buy_to_storage";
  return null;
}

export function buildAssetTypeMix(
  lines: Pick<DeviceLine, "assetType">[],
  assetTypes?: { id: string; name: string }[],
): Record<string, number> {
  const mix: Record<string, number> = {};
  lines.forEach((line) => {
    const key = resolveAssetTypeName(line.assetType, assetTypes) ?? "unknown";
    mix[key] = (mix[key] ?? 0) + 1;
  });
  return mix;
}

export function buildDispositionMixFromLines(
  lines: Pick<DeviceLine, "disposition">[],
): Partial<Record<OffboardAnalyticsDisposition, number>> {
  const mix: Partial<Record<OffboardAnalyticsDisposition, number>> = {};
  lines.forEach((line) => {
    const disposition = mapDispositionToAnalytics(line.disposition);
    if (!disposition) return;
    mix[disposition] = (mix[disposition] ?? 0) + 1;
  });
  return mix;
}

export function buildDispositionMixFromActionTypes(
  actionTypes: (ActionType | undefined)[],
): Partial<Record<OffboardAnalyticsDisposition, number>> {
  const mix: Partial<Record<OffboardAnalyticsDisposition, number>> = {};
  actionTypes.forEach((actionType) => {
    const disposition = mapActionTypeToAnalytics(actionType);
    if (!disposition) return;
    mix[disposition] = (mix[disposition] ?? 0) + 1;
  });
  return mix;
}

export function trackOffboardingStarted(
  employeeId: string,
  deviceCount: number,
): void {
  track("Offboarding Started", {
    employee_id: employeeId,
    device_count: deviceCount,
  });
}

export function trackDeviceDispositionSelected(
  disposition: OffboardAnalyticsDisposition,
  assetType: string,
): void {
  track("Device Disposition Selected", { disposition, asset_type: assetType });
}

export function trackOffboardingFeeShown(
  feeTotal: number,
  assetTypeMix: Record<string, number>,
): void {
  track("Offboarding Fee Shown", {
    fee_total: feeTotal,
    asset_type_mix: assetTypeMix,
  });
}

export function trackOffboardingConfirmed(properties: {
  order_id: string;
  device_count: number;
  disposition_mix: Partial<Record<OffboardAnalyticsDisposition, number>>;
  total_fee: number;
}): void {
  track("Offboarding Confirmed", properties);
}
