import { buildFeeRows, type TaxDisplayLabels } from "@/lib/tax/feeSummary";
import type { IEmployees } from "@/types/employees";
import type { TaxDisplayMode } from "@/types/tax";

type PaymentMethod = "Card" | "Credit";
type PreviewRecord = Record<string, any>;

export function approvalSummaryMeta(
  params: URLSearchParams,
  employees: IEmployees[],
) {
  const employee = employees.find((item) => item.requestId) as
    | (IEmployees & {
        approvalAcknowledgeBudgetWarning?: boolean;
        approvalCatalogId?: string;
      })
    | undefined;

  return {
    acknowledgeBudgetWarning:
      params.get("approvalAcknowledgeBudgetWarning") === "true" ||
      Boolean(employee?.approvalAcknowledgeBudgetWarning),
    catalogId: params.get("approvalCatalogId") ?? employee?.approvalCatalogId,
    orderRequestId: params.get("approvalOrderRequestId") ?? employee?.requestId,
    returnPath: params.get("approvalReturnPath") ?? undefined,
  };
}

export function approvalPreviewFees(
  response: unknown,
  paymentMethod: PaymentMethod,
  taxMode: TaxDisplayMode = "inclusive",
  taxLabels?: TaxDisplayLabels,
) {
  const data = (response as PreviewRecord | undefined)?.data;
  const preview = data?.preview;
  const option = preview?.payment_options?.[paymentMethod];
  const nestedSummary =
    option?.fee_breakdown?.onboarding?.fee_summary ??
    option?.fee_breakdown?.storage_to_employee?.fee_summary;
  const feeSummary = option?.fee_summary
    ? {
        ...option.fee_summary,
        currency:
          nestedSummary?.currency ?? data?.order_request?.currency ?? undefined,
      }
    : undefined;

  return {
    totalEquipment:
      Number(option?.onboarding_items ?? 0) +
      Number(option?.storage_items ?? 0),
    totalFeesArray: buildFeeRows(feeSummary, taxMode, taxLabels),
    totalFeesSummary: feeSummary,
  };
}

export function approvalPreviewEmployeeFees(
  response: unknown,
  paymentMethod: PaymentMethod,
  employeeId?: string,
) {
  if (!employeeId) return undefined;
  const option = (response as PreviewRecord | undefined)?.data?.preview
    ?.payment_options?.[paymentMethod];

  return (
    option?.fee_breakdown?.onboarding?.fees?.[employeeId]?.fees ??
    option?.fee_breakdown?.storage_to_employee?.fees?.[employeeId]?.fees
  );
}
