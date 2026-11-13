export const locationsPageSectionClass =
  "flex flex-col gap-6 pt-8 pb-12 sm:pt-12 sm:pb-24";

export const locationsTableShellClass =
  "relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200";

export const locationsTableToolbarClass =
  "flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between";

export const locationsTableTitleClass =
  "flex items-center gap-2 text-lg font-semibold text-gray-900";

export const locationsTableCountBadgeClass =
  "rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200";

export const LOCATION_FORM_SLIDEOUT_RESIZE = {
  min: 400,
  max: 640,
  initial: 480,
} as const;

export const locationsRowActionItemClass =
  "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-none px-4 py-2.5 text-sm font-semibold";

export const locationsStaffModalContentClass =
  "max-w-lg gap-0 rounded-2xl border-0 bg-white p-6 shadow-xl sm:rounded-2xl";

export const locationsStaffModalHeaderClass =
  "flex items-start justify-between gap-4";

export const locationsStaffModalCloseButtonClass =
  "rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export const locationsStaffModalTitleClass =
  "mt-4 text-base font-semibold text-gray-900";

export const locationsStaffModalDescriptionClass = "mt-1 text-sm text-gray-600";

export const locationsStaffModalBodyClass = "mt-5 flex flex-col gap-4";

export const locationsStaffModalFooterClass = "mt-6";

export const locationsDeleteModalContentClass =
  "flex w-full max-w-md flex-col items-center gap-0 rounded-2xl border-0 bg-white p-6 text-center shadow-xl sm:rounded-2xl";

export const locationsDeleteModalCloseButtonClass =
  "absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg p-2 text-gray-400 transition duration-100 ease-linear hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export const locationsDeleteModalTitleClass =
  "mt-4 text-base font-semibold text-gray-900";

export const locationsDeleteModalBodyClass = "mt-1 text-sm text-gray-600";

export const locationsDeleteModalFooterClass =
  "mt-6 grid w-full grid-cols-2 gap-3";

export const locationsDeleteModalCancelClass =
  "w-full border-gray-300 text-sm font-semibold text-gray-700";

export const locationsDeleteModalConfirmClass =
  "w-full bg-error-600 text-sm font-semibold hover:bg-error-700";
