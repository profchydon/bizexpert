import formatAmount from "@/utils/formatAmount";

export const summaryGridClassName =
  "grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-4 gap-y-10 pt-12 md:grid-cols-4 md:gap-x-6 md:gap-y-0 md:pt-16 lg:grid-cols-5";

export const overviewChartsSectionClass =
  "grid grid-cols-1 gap-4 lg:grid-cols-[7fr_3fr]";

export const orderFrequencyChartShellClass =
  "w-full overflow-x-auto overscroll-x-contain lg:overflow-visible";

export const orderFrequencyChartCanvasClass =
  "aspect-auto h-[240px] w-full min-w-[34rem] sm:min-w-0 sm:h-[250px] lg:h-[250px] lg:max-h-[250px]";

export const getOrderFrequencyChartSettings = (isLargeScreen: boolean) => ({
  barSize: isLargeScreen ? 32 : 18,
  xAxisInterval: isLargeScreen ? 0 : ("preserveStartEnd" as const),
  minTickGap: isLargeScreen ? 0 : 12,
});

export const overviewResponsiveTableClass = {
  desktop: "hidden lg:block",
  mobile: "lg:hidden",
} as const;

export const categoriesBreakdownLayoutClass = {
  content:
    "flex w-full min-w-0 flex-col items-stretch gap-y-5 sm:flex-row sm:items-center sm:gap-6",
  chartShell: "relative mx-auto h-[160px] w-[160px] shrink-0 sm:mx-0",
  legend: "flex min-w-0 flex-1 flex-col gap-2.5",
  legendItem: "flex min-w-0 items-center gap-2",
  legendLabel: "truncate text-sm text-secondary",
  chartCanvasClass: "h-[160px] w-[160px]",
} as const;

export const formatOverviewBalanceAmount = (
  value: string | number | undefined,
  currencySymbol = "",
) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return `${currencySymbol}0`;
  }

  return `${currencySymbol}${formatAmount(numeric)}`;
};

export const overviewBalanceRowClassName =
  "flex items-start justify-between gap-3";

export const overviewBalanceValueClassName =
  "min-w-0 break-all text-right text-2xl font-semibold text-primary";
