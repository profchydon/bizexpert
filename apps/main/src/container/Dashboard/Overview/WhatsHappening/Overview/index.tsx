"use client";

import { useState } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/application/tabs/tabs";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import { currencySymbol as getCurrencySymbol } from "@/utils/currencySymbol";
import {
  dashboardSpendingPanel,
  isDashboardSpendingVisible,
  SPEND_TABS,
  type SpendPeriodId,
} from "../../dashboardSpending";
import { overviewCardShellClass } from "../../overviewDashboardClasses";
import {
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "../../overviewTableClasses";
import { useOverviewCreditView } from "./OverviewCreditStanding";
import { SpendingTabContent } from "./SpendingTabContent";

const Overview = () => {
  const [period, setPeriod] = useState<SpendPeriodId>("12m");
  const { data: dashboardRes } = useWorkspaceDashboardQuery();
  const { currencyCode } = useWorkspaceEquipmentDefaults();
  const creditView = useOverviewCreditView();
  const panel = dashboardSpendingPanel(dashboardRes?.data);
  const currencySymbol = getCurrencySymbol(currencyCode);

  if (!isDashboardSpendingVisible(dashboardRes?.data)) {
    return null;
  }

  return (
    <div className={overviewCardShellClass}>
      <div className="flex flex-col gap-0.5 px-4 pt-4">
        <h3 className={overviewSectionHeadingClass}>Overview</h3>
        <p className={`truncate ${overviewSectionDescriptionClass}`}>
          Manage and track your spending.
        </p>
      </div>
      <div className="mx-4 mt-5 border-b border-secondary" />

      <Tabs defaultSelectedKey="all" className="flex flex-1 flex-col">
        <div className="px-4 pt-3">
          <TabList type="underline" size="sm" items={SPEND_TABS}>
            {(item) => <Tab id={item.id}>{item.label}</Tab>}
          </TabList>
        </div>

        {SPEND_TABS.map((tab) => (
          <TabPanel key={tab.id} id={tab.id} className="flex flex-1 flex-col">
            <SpendingTabContent
              tabId={tab.id}
              panel={panel}
              period={period}
              onPeriodChange={setPeriod}
              creditView={creditView}
              currencySymbol={currencySymbol}
            />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default Overview;
