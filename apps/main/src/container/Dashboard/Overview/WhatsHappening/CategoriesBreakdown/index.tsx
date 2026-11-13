import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { categoriesBreakdownLayoutClass } from "../../overviewDashboardLayout";
import {
  overviewCardBodyClass,
  overviewCardShellClass,
  overviewEmptyStateTooltipClass,
} from "../../overviewDashboardClasses";
import {
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "../../overviewTableClasses";
import { dashboardTypesBreakdown } from "../../dashboardOrdering";
import { shouldUseTypesBarList } from "../../overviewFeatureRules";
import { toTypesBreakdownChartData } from "../../typesBreakdownColors";
import CategorieChart from "./CategorieBreakdownChart";
import { CategoryBarList } from "./CategoryBarList";

const CategoriesBreakdown = () => {
  const { data: dashboadRes } = useWorkspaceDashboardQuery();
  const chartData = toTypesBreakdownChartData(
    dashboardTypesBreakdown(dashboadRes?.data),
  );
  const hasChartData = chartData.length !== 0;
  const useBarList = hasChartData && shouldUseTypesBarList(chartData.length);

  let body = (
    <div className="grid min-h-[160px] flex-1 place-content-center">
      <div className={overviewEmptyStateTooltipClass}>
        No available data yet
      </div>
    </div>
  );

  if (useBarList) {
    body = (
      <CategoryBarList
        data={chartData.map((item) => ({
          label: item.category,
          value: item.count,
        }))}
      />
    );
  } else if (hasChartData) {
    body = (
      <div className={categoriesBreakdownLayoutClass.content}>
        <div className={categoriesBreakdownLayoutClass.chartShell}>
          <CategorieChart chartData={chartData} />
        </div>
        <div className={categoriesBreakdownLayoutClass.legend}>
          {chartData.map((data, index) => (
            <div
              key={`${data.category}-${index}`}
              className={categoriesBreakdownLayoutClass.legendItem}
            >
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: data.fill }}
              />
              <span
                className={categoriesBreakdownLayoutClass.legendLabel}
                title={data.category}
              >
                {data.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={overviewCardShellClass}>
      <div className="border-b border-border-secondary px-6 py-4">
        <p className={overviewSectionHeadingClass}>Types breakdown</p>
        <p className={`mt-0.5 ${overviewSectionDescriptionClass}`}>
          View the distribution of your assets across different types.
        </p>
      </div>
      <div
        className={
          useBarList
            ? "flex flex-1 flex-col justify-center px-6 py-6"
            : `${overviewCardBodyClass} justify-center`
        }
      >
        {body}
      </div>
    </div>
  );
};

export default CategoriesBreakdown;
