"use client";

import { useGetTelemetrySummaryQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";
import { resolveFleetTone } from "../utils/fleetTone";
import { useFleetTelemetryScopeParams } from "./useFleetTelemetryScopeParams";

function countSummaryInsights(stats?: {
  needs_attention_count?: number;
  stale_count?: number;
  no_agent_count?: number;
}): number {
  if (!stats) return 0;
  let count = 0;
  if ((stats.needs_attention_count ?? 0) > 0) count += 1;
  if ((stats.stale_count ?? 0) > 0) count += 1;
  if ((stats.no_agent_count ?? 0) > 0) count += 1;
  return count;
}

export function useFleetSummary() {
  const { companyId } = useWorkspaceScopedCompanyArgs();
  const scopeParams = useFleetTelemetryScopeParams();

  const query = useGetTelemetrySummaryQuery(
    { companyId: companyId ?? "", params: scopeParams },
    { skip: !companyId },
  );

  const payload = query.data?.data;
  const posture = payload?.controls?.posture;
  const passRate = posture?.pass_rate ?? null;
  const tone = resolveFleetTone(passRate);

  return {
    ...query,
    payload,
    passRate,
    tone,
    insightCount: countSummaryInsights(payload?.stats),
  };
}
