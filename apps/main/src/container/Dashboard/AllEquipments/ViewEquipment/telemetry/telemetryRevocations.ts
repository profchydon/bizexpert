"use client";

import { useGetTelemetryDeviceQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export interface Revocation {
  revokedOn: string;
  revokedAt: number;
  revokedBy: string;
}

export function useRevocation(deviceId: string): Revocation | null {
  const companyId = useWorkspaceCompanyId() as string;
  const query = useGetTelemetryDeviceQuery(
    { companyId, deviceId },
    { skip: !companyId || !deviceId },
  );
  const device = query.data?.data;
  if (!device?.flags.revoked && !device?.agent?.stopped_at) return null;
  const stopped = device.agent?.stopped_at ?? "";
  const revokedOn = stopped
    ? new Date(stopped).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "today";
  const revokedAt = stopped ? Date.parse(stopped) : Date.now();
  return {
    revokedOn,
    revokedAt: Number.isFinite(revokedAt) ? revokedAt : Date.now(),
    revokedBy: "Your team",
  };
}

export function revokedDays(revocation: Revocation | null): number {
  if (!revocation?.revokedAt) return 0;
  return Math.max(
    0,
    Math.floor((Date.now() - revocation.revokedAt) / 86_400_000),
  );
}
