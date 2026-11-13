"use client";

import React, { useEffect, useState } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import DashboardMap from "../DashboardMap";
import { useLazyGetDashboardCountrySummaryQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboardCountrySummary";
import { IDashboardCountrySummary } from "@/types/dashboard";
import {
  CountryMapCoordinate,
  mapCountriesToCoordinates,
} from "@/utils/mapCountriesToCoordinates";
import { overviewMapShellClass } from "../../overviewDashboardClasses";

const GlobalPresenceMap = () => {
  const companyId = useWorkspaceCompanyId();

  const [countries, setCountries] = useState<CountryMapCoordinate[]>([]);
  const [dashboardCountrySummary, setDashboardCountrySummary] = useState<
    IDashboardCountrySummary[]
  >([]);

  const [triggerSummaryQuery] = useLazyGetDashboardCountrySummaryQuery();

  useEffect(() => {
    if (!companyId) return;

    (async () => {
      try {
        const res = await triggerSummaryQuery({
          companyId,
        }).unwrap();
        const summary = res?.data ?? [];
        setDashboardCountrySummary(summary);
        setCountries(mapCountriesToCoordinates(summary));
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    })();
  }, [companyId, triggerSummaryQuery]);

  return (
    <div className={`${overviewMapShellClass} hidden md:block`}>
      <div className="relative">
        {dashboardCountrySummary.length === 0 && (
          <>
            <div className="absolute inset-0 z-[100] h-full w-full backdrop-blur-sm" />
            <div className="absolute inset-0 z-[101] grid h-full w-full place-content-center">
              <div className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
                No available data yet
              </div>
            </div>
          </>
        )}
        <DashboardMap mapData={countries} />
      </div>
    </div>
  );
};

export default GlobalPresenceMap;
