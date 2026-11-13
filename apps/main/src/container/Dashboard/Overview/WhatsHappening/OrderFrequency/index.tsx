import { Button } from "@/components/base/buttons/button";
import routes from "@/routes";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import {
  dashboardOrderingFrequency,
  hasOrderingFrequencyData,
} from "../../dashboardOrdering";
import { orderFrequencyChartShellClass } from "../../overviewDashboardLayout";
import {
  overviewCardBodyClass,
  overviewCardDividerClass,
  overviewCardHeaderClass,
  overviewCardHeaderRowClass,
  overviewCardShellClass,
  overviewEmptyStateTooltipClass,
} from "../../overviewDashboardClasses";
import {
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "../../overviewTableClasses";
import OrderFrequencyChart from "./OrderFrequencyChart";

const OrderFrequency = () => {
  const { data: dashboadRes } = useWorkspaceDashboardQuery();
  const chartData = dashboardOrderingFrequency(dashboadRes?.data);
  const hasChartData = hasOrderingFrequencyData(dashboadRes?.data);

  return (
    <div className={overviewCardShellClass}>
      <div className={overviewCardHeaderClass}>
        <div className={overviewCardHeaderRowClass}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className={overviewSectionHeadingClass}>Ordering frequency</h3>
            <p className={overviewSectionDescriptionClass}>
              View the ordering frequency for employee devices
            </p>
          </div>
          <Button
            color="secondary"
            size="sm"
            href={routes.ORDERS}
            className="w-full shrink-0 sm:w-auto"
            data-testid="orderfrequency-button"
          >
            View orders
          </Button>
        </div>
      </div>
      <div className={overviewCardDividerClass} />
      <div className={`${overviewCardBodyClass} relative min-h-[232px]`}>
        <div
          className={`relative min-w-0 flex-1 ${orderFrequencyChartShellClass}`}
        >
          {!hasChartData && (
            <>
              <div className="absolute inset-0 z-[100] h-full w-full backdrop-blur-sm" />
              <div className="absolute inset-0 z-[101] grid h-full w-full place-content-center">
                <div className={overviewEmptyStateTooltipClass}>
                  No available data yet
                </div>
              </div>
            </>
          )}
          <OrderFrequencyChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default OrderFrequency;
