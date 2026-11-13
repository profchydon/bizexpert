export const referenceTableHeaderClass = "bg-secondary [&_tr]:border-0";

export const referenceTableHeadCellClass =
  "relative h-11 border-0 px-6 py-2 text-left align-middle text-xs font-semibold text-quaternary after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border-secondary";

export const referenceTableRowClass =
  "group border-0 transition-colors hover:bg-secondary data-[state=selected]:bg-secondary [&>td]:relative [&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden";

export const referenceTableCellClass =
  "px-6 py-4 align-middle text-sm text-tertiary";

export const referenceDataTableProps = {
  containerClassName: "space-y-0",
  tableClassName: "w-full table-auto min-w-max",
  headerClassName: referenceTableHeaderClass,
  headerCellClassName: referenceTableHeadCellClass,
  rowClassName: referenceTableRowClass,
  cellClassName: referenceTableCellClass,
} as const;

export const referenceNativeTableClass = "w-full border-collapse text-left";

export const referenceNativeHeadRowClass =
  "bg-secondary [&>th]:relative [&>th]:after:pointer-events-none [&>th]:after:absolute [&>th]:after:inset-x-0 [&>th]:after:bottom-0 [&>th]:after:h-px [&>th]:after:bg-border-secondary";

export const referenceNativeHeadCellClass =
  "h-11 border-0 px-6 py-2 text-xs font-semibold text-quaternary";

export const referenceNativeBodyRowClass =
  "group transition-colors hover:bg-secondary [&>td]:relative [&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-border-secondary last:[&>td]:after:hidden";

export const referenceNativeBodyCellClass =
  "px-6 py-4 align-middle text-sm text-tertiary";

export const referenceTableShellClass =
  "overflow-hidden rounded-xl border border-border-secondary bg-primary shadow-xs";

export const referenceTablePaginationClass =
  "border-t border-border-secondary px-6 py-3";

export const referenceTableCardHeaderDividerClass =
  "border-b border-border-secondary";
