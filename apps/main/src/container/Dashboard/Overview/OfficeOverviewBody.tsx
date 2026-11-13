"use client";

import type { ReactNode } from "react";
import { Banknote, ShoppingBag, Truck, Users } from "lucide-react";
import { useGetOfficeQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffice";
import { OfficeStatsCard } from "@/container/Dashboard/Accounts/Offices/detail/components/OfficeStatsCard";
import { toUiOfficeFromDetail } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";
import { resolveEntityCountryCode } from "@/app/dashboard/NavBar/resolveEntityCountryCode";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { OverviewScopedHeader } from "./OverviewScopedHeader";
// import { FleetHealthStrip } from "./FleetHealthStrip";
import RecentOrders from "./WhatsHappening/RecentOrders";
import { dashboardOverviewCards } from "./dashboardOverviewCards";
import { officeOverviewMetrics } from "./officeOverviewMetrics";
import {
  officeOverviewSubtitle,
  pickOfficeOverviewTarget,
} from "./overviewTier";
import SummaryCard from "./Summary/SummaryCard";
import { overviewOfficeMetricGridClass } from "./overviewDashboardClasses";
import type { IDashboard } from "@/types/dashboard";

const officeMetricIcons: Record<
  ReturnType<typeof officeOverviewMetrics>[number]["label"],
  ReactNode
> = {
  Employees: <Users className="text-white" />,
  Assets: <ShoppingBag className="text-white" />,
  "Active orders": <Truck className="text-white" />,
  "Asset value": <Banknote className="text-white" />,
};

export function OfficeOverviewBody({
  dashboardData,
}: Readonly<{
  dashboardData: IDashboard;
}>) {
  const { access } = useActiveWorkspace();
  const target = pickOfficeOverviewTarget(access);
  const officeQuery = useGetOfficeQuery(
    {
      companyId: target.companyId ?? "",
      officeId: target.officeId ?? "",
    },
    { skip: !target.companyId || !target.officeId },
  );
  const detail = officeQuery.data?.data;
  const office = detail ? toUiOfficeFromDetail(detail) : undefined;
  const metrics = officeOverviewMetrics({
    snapshot: detail?.snapshot,
    activeOrders: dashboardOverviewCards(dashboardData).total_active_orders,
    currency: office?.currency ?? "",
  });

  return (
    <>
      <OverviewScopedHeader
        title={office?.name ?? "Overview"}
        subtitle={officeOverviewSubtitle(
          office?.subsidiaryName ?? "",
          office?.region ?? "",
        )}
        countryCode={
          office?.region ? resolveEntityCountryCode(office.region) : undefined
        }
      />
      {/* <FleetHealthStrip /> */}
      <div className={overviewOfficeMetricGridClass}>
        {metrics.map((metric) => (
          <SummaryCard
            key={metric.label}
            title={metric.label}
            description={metric.value}
            icon={officeMetricIcons[metric.label]}
          />
        ))}
      </div>
      <div className="mt-8 space-y-6">
        <OfficeStatsCard
          snapshot={detail?.snapshot}
          currency={office?.currency ?? ""}
        />
        <RecentOrders />
      </div>
    </>
  );
}
