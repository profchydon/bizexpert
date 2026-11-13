"use client";

import { useGetTelemetryDeviceQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export function useInstallRequest(deviceId: string): string | null {
  const companyId = useWorkspaceCompanyId() as string;
  const query = useGetTelemetryDeviceQuery(
    { companyId, deviceId },
    { skip: !companyId || !deviceId },
  );
  const lastSent = query.data?.data.install_request?.last_sent_at;
  if (!lastSent) return null;
  const date = new Date(lastSent);
  if (Number.isNaN(date.getTime())) return lastSent;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
