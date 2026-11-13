import { referenceDataTableProps } from "@/components/application/table/reference-table-classes";

export const overviewDataTableProps = {
  ...referenceDataTableProps,
  tableClassName: "min-w-[700px]",
} as const;

export const overviewMobileDataTableProps = {
  ...overviewDataTableProps,
  tableClassName: "min-w-0",
} as const;

export const overviewSectionHeadingClass = "text-lg font-semibold text-primary";

export const overviewSectionDescriptionClass = "text-sm text-tertiary";
