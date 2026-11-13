"use client";

import { Badge } from "@/components/base/badges/badges";
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import {
  overviewCreditCopy,
  type OverviewCreditView,
} from "../../overviewCreditStanding";
import {
  activeSpendingLabel,
  creditFacilityFromPanel,
  formatSpendingAmount,
  hasSpendingChartData,
  spendAmountForTab,
  spendingChartPoints,
  type SpendPeriodId,
  type SpendTabId,
} from "../../dashboardSpending";
import type { IDashboardSpendingPanel } from "@/types/dashboard";
import { CreditFacilityMeter } from "./CreditFacilityMeter";
import { SpendingBarChart } from "./SpendingBarChart";

export function SpendingTabContent({
  tabId,
  panel,
  period,
  onPeriodChange,
  creditView,
  currencySymbol,
}: Readonly<{
  tabId: SpendTabId;
  panel: IDashboardSpendingPanel | null;
  period: SpendPeriodId;
  onPeriodChange: (period: SpendPeriodId) => void;
  creditView: OverviewCreditView | null;
  currencySymbol: string;
}>) {
  const { push, isPending } = useTransitionRouter();
  const isCredit = tabId === "credit";
  const facility = creditFacilityFromPanel(panel);
  const showMeter = isCredit && facility.limit > 0;
  const hasChart = hasSpendingChartData(panel, tabId, period);
  const chartData = spendingChartPoints(panel, tabId, period);
  const spendTotal = formatSpendingAmount(
    spendAmountForTab(panel, tabId, period),
    currencySymbol,
  );
  const copy = creditView ? overviewCreditCopy(creditView) : null;

  const standingBadge = copy ? (
    <Tooltip title="Net-30 invoices are settled monthly, up to your approved limit.">
      <TooltipTrigger className="cursor-default">
        <Badge color={copy.color} size="sm">
          {copy.label}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  ) : null;

  return (
    <>
      {showMeter ? (
        <CreditFacilityMeter
          limit={facility.limit}
          available={facility.available}
          badge={standingBadge}
          currencySymbol={currencySymbol}
        />
      ) : null}

      {isCredit && !showMeter ? (
        <div className="flex flex-col items-start gap-3 px-4 pt-5">
          {standingBadge}
          {copy ? (
            <p className="text-sm text-tertiary">{copy.context}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-4 pt-5">
        {isCredit ? <div className="mb-5 border-b border-secondary" /> : null}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-lg leading-7 font-semibold text-primary">
              Spending over time
            </h4>
            <span className="text-xl leading-7 font-semibold text-primary tabular-nums">
              {spendTotal}
            </span>
          </div>
          <ButtonGroup
            size="sm"
            selectedKeys={new Set([period])}
            onSelectionChange={(keys) => {
              const key = [...keys][0] as SpendPeriodId;
              if (key) {
                onPeriodChange(key);
              }
            }}
          >
            <ButtonGroupItem id="12m">12 months</ButtonGroupItem>
            <ButtonGroupItem id="30d">30 days</ButtonGroupItem>
            <ButtonGroupItem id="7d">7 days</ButtonGroupItem>
          </ButtonGroup>
        </div>
        <div className="mt-5 border-b border-secondary" />
        <SpendingBarChart
          data={chartData}
          activeLabel={hasChart ? activeSpendingLabel(period) : undefined}
          noData={!hasChart}
          currencySymbol={currencySymbol}
        />
      </div>

      <div className="border-t border-secondary px-4 py-5">
        <div className="flex justify-end">
          <Button
            color="secondary"
            size="sm"
            isLoading={isPending}
            onClick={() => push(routes.TRANSACTIONS)}
            data-testid="spendingtabcontent-button"
          >
            View transactions
          </Button>
        </div>
      </div>
    </>
  );
}
