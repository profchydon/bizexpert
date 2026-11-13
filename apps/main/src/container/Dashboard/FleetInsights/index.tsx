"use client";

import { useCallback, useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import PageState from "@/components/PageState";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import FleetInsightsAccessWrapper from "./FleetInsightsAccessWrapper";
import { FleetAttentionTable } from "./components/FleetAttentionTable";
import { FleetComplianceControls } from "./components/FleetComplianceControls";
import { FleetEmptyState } from "./components/FleetEmptyState";
import { FleetFilterBanner } from "./components/FleetFilterBanner";
import { FleetGapBreakdown } from "./components/FleetGapBreakdown";
import { FleetInsightsList } from "./components/FleetInsightsList";
import { FleetNotAuthorizedState } from "./components/FleetNotAuthorizedState";
import { FleetOsDonut } from "./components/FleetOsDonut";
import { FleetPostureBand } from "./components/FleetPostureBand";
import { FleetRestartHygiene } from "./components/FleetRestartHygiene";
import { FleetScopeLabel } from "./components/FleetScopeLabel";
import { FleetStatTiles } from "./components/FleetStatTiles";
import { useFleetTelemetry } from "./hooks/useFleetTelemetry";
import type { FleetListFilter } from "./utils/fleetFilters";
import { applyFleetListFilter } from "./utils/fleetFilters";

function FleetInsightsBody() {
  const { back } = useTransitionRouter();
  const tableRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FleetListFilter | null>(
    null,
  );
  const {
    isLoading,
    isError,
    isFetching,
    devices,
    stats,
    controls,
    posture,
    passRate,
    tone,
    insights,
    scope,
    error,
  } = useFleetTelemetry();

  const scrollToTable = useCallback(() => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const applyFilter = useCallback(
    (filter: FleetListFilter) => {
      setActiveFilter(filter);
      scrollToTable();
    },
    [scrollToTable],
  );

  const filteredCount = applyFleetListFilter(devices, activeFilter).length;
  const isUnauthorized =
    isError &&
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    (error as { status?: number }).status === 403;

  if (isLoading || isFetching) {
    return <PageState isLoading isError={false} />;
  }

  if (isUnauthorized) {
    return <FleetNotAuthorizedState />;
  }

  if (isError) {
    return <PageState isLoading={false} isError />;
  }

  const vaultCount = stats?.vault_count ?? devices.length;
  const isEmptyFleet = vaultCount === 0;

  return (
    <div className="flex flex-col gap-6 py-8">
      <PageHeader
        breadCrumbs={["Fleet Insights"]}
        pageTitle="Fleet Insights"
        pageDescription="Monitor compliance posture, agent coverage, and device health across your fleet."
        extraDescription={<FleetScopeLabel scope={scope} />}
        onBack={back}
      />

      {isEmptyFleet ? (
        <FleetEmptyState />
      ) : (
        <>
          <FleetPostureBand posture={posture} tone={tone} passRate={passRate} />
          <FleetStatTiles
            stats={stats}
            devices={devices}
            activeFilter={activeFilter}
            onSelect={applyFilter}
            onClear={() => setActiveFilter(null)}
          />
          <FleetInsightsList
            insights={insights}
            devices={devices}
            onShowFilter={applyFilter}
          />
          <FleetComplianceControls controls={controls} onFilter={applyFilter} />
          <FleetGapBreakdown devices={devices} onFilter={applyFilter} />
          <div className="grid gap-6 lg:grid-cols-2">
            <FleetOsDonut devices={devices} onFilter={applyFilter} />
            <FleetRestartHygiene devices={devices} />
          </div>
          {activeFilter ? (
            <FleetFilterBanner
              filter={activeFilter}
              count={filteredCount}
              onClear={() => setActiveFilter(null)}
            />
          ) : null}
          <FleetAttentionTable
            devices={devices}
            filter={activeFilter}
            tableRef={tableRef}
          />
        </>
      )}
    </div>
  );
}

export default function FleetInsights() {
  return (
    <FleetInsightsAccessWrapper>
      <FleetInsightsBody />
    </FleetInsightsAccessWrapper>
  );
}
