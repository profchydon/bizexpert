import type {
  ApproveCatalogOrderRequestPayload,
  CatalogOrderRequestApprovalStats,
  ConvertCatalogOrderRequestToRfqDevice,
  ConvertCatalogOrderRequestToRfqPayload,
} from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";
import type {
  ApprovalActionOptions,
  ApprovalEmployee,
  ApprovalFilterTab,
  ApprovalRecord,
  ApprovalSort,
  ApprovalStatus,
  ItemSource,
  ItemTier,
} from "./types";

export const statusLabels: Record<ApprovalStatus, string> = {
  AWAITING_APPROVAL: "Awaiting approval",
  AWAITING_RFQ: "Awaiting RFQ",
  APPROVED: "Approved",
  FAILED: "Rejected",
  CANCELLED: "Cancelled",
};

export const statusStyles: Record<ApprovalStatus, string> = {
  AWAITING_APPROVAL: "bg-warning-50 text-warning-700 ring-warning-200",
  AWAITING_RFQ: "bg-primary-50 text-primary-700 ring-primary-200",
  APPROVED: "bg-success-50 text-success-700 ring-success-200",
  FAILED: "bg-error-50 text-error-700 ring-error-200",
  CANCELLED: "bg-gray-50 text-gray-700 ring-gray-200",
};

export const sourceStyles: Record<ItemSource, string> = {
  STORAGE: "border-success-600 text-success-700",
  MARKETPLACE: "border-primary-600 text-primary-700",
  RFQ: "border-warning-600 text-warning-700",
  UNAVAILABLE: "border-error-600 text-error-700",
};

export const tierLabels: Record<ItemTier, string> = {
  IMPORTANT: "Important",
  REQUIRED: "Required",
  OPTIONAL: "Optional",
};

export const defaultApprovalTab: ApprovalFilterTab = "awaiting";

export type ApprovalCounts = {
  approved: number;
  awaiting: number;
  rejected: number;
  rfq: number;
};

export function computeApprovalCounts(
  records: ApprovalRecord[],
): ApprovalCounts {
  const awaiting = records.filter(
    (item) => item.status === "AWAITING_APPROVAL",
  );
  const oneWeekAgo = Date.now() - 7 * 24 * 3600_000;
  return {
    awaiting: awaiting.length,
    rfq: records.filter((item) => item.status === "AWAITING_RFQ").length,
    approved: records.filter(
      (item) =>
        item.status === "APPROVED" &&
        item.actionedBy?.at &&
        new Date(item.actionedBy.at).getTime() >= oneWeekAgo,
    ).length,
    rejected: records.filter(
      (item) =>
        item.status === "FAILED" &&
        item.actionedBy?.at &&
        new Date(item.actionedBy.at).getTime() >= oneWeekAgo,
    ).length,
  };
}

export function approvalStatsToCounts(
  stats?: CatalogOrderRequestApprovalStats,
): ApprovalCounts | undefined {
  if (!stats) return undefined;
  return {
    approved: numberValue(stats.approved_last_seven_days),
    awaiting: numberValue(stats.pending_approval_count),
    rejected: numberValue(stats.rejected_last_seven_days),
    rfq: numberValue(stats.pending_rfq_count),
  };
}

export function filterApprovals({
  employees,
  records,
  search,
  tab,
}: {
  employees: Map<string, ApprovalEmployee>;
  records: ApprovalRecord[];
  search: string;
  tab: ApprovalFilterTab;
}) {
  const query = search.trim().toLowerCase();
  return records.filter((record) => {
    if (!matchesTab(record, tab)) return false;
    if (!query) return true;
    const employee = employees.get(record.employeeId);
    return [
      employee?.name,
      employee?.role,
      record.kitName,
      record.matchedRuleName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export function recordsForApprovalTab({
  allRecords,
  pendingRecords,
  tab,
}: {
  allRecords: ApprovalRecord[];
  pendingRecords: ApprovalRecord[];
  tab: ApprovalFilterTab;
}) {
  return tab === "awaiting" ? pendingRecords : allRecords;
}

export function selectedApprovalRecord({
  selectedDetail,
  selectedSummary,
}: {
  selectedDetail: ApprovalRecord | null;
  selectedSummary: ApprovalRecord | null;
}) {
  if (!selectedSummary) return null;
  return selectedDetail?.id === selectedSummary.id
    ? selectedDetail
    : selectedSummary;
}

export function formatApprovalMoney({
  amount,
  currencyCode,
  currencySymbol,
}: {
  amount?: number;
  currencyCode?: string;
  currencySymbol?: string;
}) {
  if (amount == null) return "-";
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount).toLocaleString();
  if (currencySymbol) return `${sign}${currencySymbol}${value}`;
  return currencyCode ? `${sign}${currencyCode} ${value}` : `${sign}${value}`;
}

export function formatApprovalDateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function sortApprovals(
  records: ApprovalRecord[],
  employees: Map<string, ApprovalEmployee>,
  sort: ApprovalSort,
) {
  const direction = sort.direction === "ascending" ? 1 : -1;
  return [...records].sort((a, b) => {
    if (sort.column === "employee") {
      return (
        direction * nameFor(a, employees).localeCompare(nameFor(b, employees))
      );
    }
    if (sort.column === "kit")
      return direction * (a.kitName ?? "").localeCompare(b.kitName ?? "");
    if (sort.column === "status")
      return direction * (a.status ?? "").localeCompare(b.status ?? "");
    if (sort.column === "total") {
      return direction * ((a.totalAmount ?? 0) - (b.totalAmount ?? 0));
    }
    return 0;
  });
}

export function uniqueApprovalSources(record: ApprovalRecord): ItemSource[] {
  return Array.from(
    new Set([
      ...(record.fulfillmentSources ?? []),
      ...record.items.flatMap((item) => (item.source ? [item.source] : [])),
    ]),
  );
}

export function approvalPrimaryActionLabel(record: ApprovalRecord) {
  return uniqueApprovalSources(record).includes("UNAVAILABLE")
    ? "Convert to RFQ"
    : "Approve";
}

export const unavailableApprovalFooterNote =
  "Some items in your order are currently unavailable. Convert them to a Request for Quote (RFQ) so our team can source them for you. Click “Convert to RFQ” to submit your request and we’ll get back to you shortly.";

export function approvalFooterNoteText({
  historical,
  record,
}: {
  historical: boolean;
  record: ApprovalRecord;
}) {
  if (record.orderNote) return `Order note: ${record.orderNote}`;
  if (!historical && approvalPrimaryActionLabel(record) === "Convert to RFQ") {
    return unavailableApprovalFooterNote;
  }
  return "Review this card before placing the order.";
}

export function approveOrderRequestPayload(
  options?: ApprovalActionOptions,
): ApproveCatalogOrderRequestPayload | undefined {
  return options?.acknowledgeBudgetWarning
    ? { acknowledge_budget_warning: true }
    : undefined;
}

export function convertToRfqPayload(
  record: ApprovalRecord,
): ConvertCatalogOrderRequestToRfqPayload {
  const devices = record.items.flatMap(
    (item): ConvertCatalogOrderRequestToRfqDevice[] => {
      if (item.source !== "UNAVAILABLE" || !item.kitItemId) return [];
      return [
        {
          ...(item.assetType ? { asset_type: item.assetType } : {}),
          budget_per_unit: Math.max(0, item.rfqBudgetPerUnit ?? 0),
          ...(item.description ? { description: item.description } : {}),
          kit_item_id: item.kitItemId,
          ...(item.name ? { name: item.name } : {}),
          quantity: Math.max(1, item.quantity ?? 1),
        },
      ];
    },
  );

  return { devices };
}

function matchesTab(record: ApprovalRecord, tab: ApprovalFilterTab) {
  if (tab === "all") return true;
  if (!record.status) return false;
  if (tab === "awaiting") {
    return ["AWAITING_APPROVAL", "AWAITING_RFQ"].includes(record.status);
  }
  return ["APPROVED", "FAILED", "CANCELLED"].includes(record.status);
}

function nameFor(
  record: ApprovalRecord,
  employees: Map<string, ApprovalEmployee>,
) {
  return employees.get(record.employeeId)?.name ?? "";
}

function numberValue(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
