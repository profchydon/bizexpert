export const SALE_FORM_SLIDEOUT_RESIZE = {
  min: 480,
  max: 720,
  initial: 560,
} as const;

export const salesMetricGridClass =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4";

export const salesMetricCardClass =
  "rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200";

export const salesMetricIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600";

export const salesMetricTitleClass = "text-sm font-medium text-gray-600";

export const salesMetricValueClass =
  "mt-3 text-2xl font-semibold tracking-tight text-gray-950";

export const salesMetricHintClass = "mt-1 text-xs text-gray-500";

export const salesTableHeaderClass =
  "flex flex-col gap-4 border-b border-gray-200 px-6 py-4";

export const salesTableHeaderRowClass =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

export const salesDateInputClass =
  "h-11 w-full rounded-lg bg-white px-3.5 text-sm font-medium text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:w-40";

export const salesFilterControlClass = "w-full sm:w-44";

export {
  locationsPageSectionClass as salesPageSectionClass,
  locationsTableShellClass as salesTableShellClass,
  locationsTableToolbarClass as salesTableToolbarClass,
  locationsTableTitleClass as salesTableTitleClass,
  locationsTableCountBadgeClass as salesTableCountBadgeClass,
  locationsRowActionItemClass as salesRowActionItemClass,
  locationsDeleteModalContentClass as salesDeleteModalContentClass,
  locationsDeleteModalCloseButtonClass as salesDeleteModalCloseButtonClass,
  locationsDeleteModalTitleClass as salesDeleteModalTitleClass,
  locationsDeleteModalBodyClass as salesDeleteModalBodyClass,
  locationsDeleteModalFooterClass as salesDeleteModalFooterClass,
  locationsDeleteModalCancelClass as salesDeleteModalCancelClass,
  locationsDeleteModalConfirmClass as salesDeleteModalConfirmClass,
} from "../Locations/locationsPageClasses";
