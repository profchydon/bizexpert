"use client";

import { useMemo } from "react";
import type { FleetTelemetryQueryParams } from "@/api/baseQueries/companiesApi/telemetryApi/getFleetTelemetry";
import { pickOfficeOverviewTarget } from "@/container/Dashboard/Overview/overviewTier";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";

export function useFleetTelemetryScopeParams(): FleetTelemetryQueryParams {
  const { access, activeEntityId, isGlobalWorkspace } = useActiveWorkspace();

  return useMemo(() => {
    if (access.actingRole === "office") {
      const target = pickOfficeOverviewTarget(access);
      return {
        subsidiary_id: target.companyId ?? undefined,
        office_id: target.officeId ?? undefined,
      };
    }

    if (!isGlobalWorkspace && activeEntityId) {
      return { subsidiary_id: activeEntityId };
    }

    return {};
  }, [access, activeEntityId, isGlobalWorkspace]);
}
