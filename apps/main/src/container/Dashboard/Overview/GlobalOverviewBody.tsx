"use client";

import type { IDashboard } from "@/types/dashboard";
import { ApprovalsBanner } from "./ApprovalsBanner";
// import { FleetHealthStrip } from "./FleetHealthStrip";
import DoingToday from "./DoingToday";
import JoinRequestBanner from "./JoinRequestBanner";
import OverviewDashboardHeader from "./OverviewDashboardHeader";
import { SetupBanner } from "./SetupBanner";
import Summary from "./Summary";
import WhatsHappening from "./WhatsHappening";
import { dashboardOverviewCards } from "./dashboardOverviewCards";

export function GlobalOverviewBody({
  dashboardData,
}: Readonly<{
  dashboardData: IDashboard;
}>) {
  return (
    <>
      <OverviewDashboardHeader />
      {/* <FleetHealthStrip /> */}
      <ApprovalsBanner />
      <SetupBanner />
      <Summary summaryData={dashboardOverviewCards(dashboardData)} />
      <JoinRequestBanner />
      <DoingToday />
      <WhatsHappening />
    </>
  );
}
