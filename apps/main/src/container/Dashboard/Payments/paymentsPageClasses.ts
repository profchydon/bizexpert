export const PAYMENT_FORM_SLIDEOUT_RESIZE = {
  min: 400,
  max: 640,
  initial: 480,
} as const;

export {
  locationsPageSectionClass as paymentsPageSectionClass,
  locationsTableShellClass as paymentsTableShellClass,
  locationsTableToolbarClass as paymentsTableToolbarClass,
  locationsTableTitleClass as paymentsTableTitleClass,
  locationsTableCountBadgeClass as paymentsTableCountBadgeClass,
  locationsRowActionItemClass as paymentsRowActionItemClass,
} from "../Locations/locationsPageClasses";

export {
  salesMetricGridClass as paymentsMetricGridClass,
  salesMetricCardClass as paymentsMetricCardClass,
  salesMetricIconClass as paymentsMetricIconClass,
  salesMetricTitleClass as paymentsMetricTitleClass,
  salesMetricValueClass as paymentsMetricValueClass,
  salesMetricHintClass as paymentsMetricHintClass,
  salesTableHeaderClass as paymentsTableHeaderClass,
  salesTableHeaderRowClass as paymentsTableHeaderRowClass,
  salesDateInputClass as paymentsDateInputClass,
} from "../Sales/salesPageClasses";

export {
  inventoryOverviewTwoColumnClass as paymentsAnalyticsTwoColumnClass,
  inventoryOverviewChartBodyClass as paymentsAnalyticsChartBodyClass,
} from "../Overview/inventoryOverviewClasses";
