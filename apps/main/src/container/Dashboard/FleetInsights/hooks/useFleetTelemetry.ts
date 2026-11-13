"use client";

import { useGetFleetTelemetryQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";
import { buildFleetInsights } from "../utils/buildFleetInsights";
import { resolveFleetTone } from "../utils/fleetTone";
import { useFleetTelemetryScopeParams } from "./useFleetTelemetryScopeParams";

export function useFleetTelemetry(enabled = true) {
  const { companyId } = useWorkspaceScopedCompanyArgs();
  const scopeParams = useFleetTelemetryScopeParams();

  const query = useGetFleetTelemetryQuery(
    { companyId: companyId ?? "", params: scopeParams },
    { skip: !companyId || !enabled },
  );

  const payload = query.data?.data;
  const devices = payload?.devices ?? [];
  const posture = payload?.controls?.posture;
  const passRate = posture?.pass_rate ?? null;

  return {
    ...query,
    payload,
    devices,
    stats: payload?.stats,
    controls: payload?.controls?.controls ?? [],
    posture,
    passRate,
    tone: resolveFleetTone(passRate),
    insights: buildFleetInsights(devices),
    scope: payload?.scope,
  };
}
