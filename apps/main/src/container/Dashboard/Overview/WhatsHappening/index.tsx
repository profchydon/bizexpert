"use client";

import React from "react";
import OrderFrequency from "./OrderFrequency";
import CategoriesBreakdown from "./CategoriesBreakdown";
import RecentOrders from "./RecentOrders";
import Overview from "./Overview";
import EmployeeRequestTable from "./RecentPendingCatalogRequests/EmployeeRequestTable";
import { CatalogPolicySummaryCard } from "../CatalogPolicySummaryCard";
import OverviewDashboardMap from "../OverviewDashboardMap";
import { overviewChartsSectionClass } from "../overviewDashboardLayout";
import { overviewTwoColumnGridClass } from "../overviewDashboardClasses";
import { overviewSectionDescriptionClass } from "../overviewTableClasses";

const WhatsHappening = ({
  showMap = true,
  showHeading = true,
  country,
  showCatalogRequests = true,
}: {
  showMap?: boolean;
  showHeading?: boolean;
  country?: string;
  showCatalogRequests?: boolean;
}) => {
  return (
    <div className={showHeading ? "mt-8" : undefined}>
      {showHeading ? (
        <div>
          <p className="text-base font-semibold text-primary">
            What&apos;s happening?
          </p>
          <p className={`mt-0.5 ${overviewSectionDescriptionClass}`}>
            Stay updated on key metrics and recent activities within your
            organization.
          </p>
        </div>
      ) : null}

      <div className={showHeading ? "mt-4 space-y-6" : "space-y-6"}>
        {showMap ? <OverviewDashboardMap /> : null}

        <div className={overviewChartsSectionClass}>
          <OrderFrequency />
          <CategoriesBreakdown />
        </div>

        <div className={overviewTwoColumnGridClass}>
          <RecentOrders />
          <Overview />
        </div>

        <CatalogPolicySummaryCard country={country} />

        {showCatalogRequests ? <EmployeeRequestTable /> : null}
      </div>
    </div>
  );
};

export default WhatsHappening;
