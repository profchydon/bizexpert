import type { ApprovalStatus, ItemSource, ItemTier } from "../types";
import { sourceStyles, statusLabels, statusStyles, tierLabels } from "../utils";
import {
  CheckCircle,
  Hourglass03,
  RefreshCw03,
  SlashCircle01,
  XCircle,
} from "./UntitledIcons";

const statusIcons = {
  AWAITING_APPROVAL: Hourglass03,
  AWAITING_RFQ: RefreshCw03,
  APPROVED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: SlashCircle01,
} satisfies Record<ApprovalStatus, typeof Hourglass03>;

const sourceLabels: Record<ItemSource, string> = {
  STORAGE: "Storage",
  MARKETPLACE: "Marketplace",
  RFQ: "RFQ",
  UNAVAILABLE: "Unavailable",
};

const tierStyles: Record<ItemTier, string> = {
  IMPORTANT: "bg-warning-50 text-warning-700 ring-warning-200",
  REQUIRED: "bg-primary-50 text-primary-700 ring-primary-200",
  OPTIONAL: "bg-gray-50 text-gray-700 ring-gray-200",
};

export function ApprovalStatusBadge({ status }: { status?: ApprovalStatus }) {
  if (!status) return <span className="text-sm text-gray-500">-</span>;
  const Icon = statusIcons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-normal ring-1 ring-inset ${statusStyles[status]}`}
    >
      <Icon size={12} />
      {statusLabels[status]}
    </span>
  );
}

export function ItemSourceBadge({ source }: { source: ItemSource }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-[1.5px] px-2 py-0.5 text-xs font-normal ${sourceStyles[source]}`}
    >
      {sourceLabels[source]}
    </span>
  );
}

export function TierBadge({ tier }: { tier?: ItemTier }) {
  if (!tier) return <span className="text-xs text-gray-500">-</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-normal ring-1 ring-inset ${tierStyles[tier]}`}
    >
      {tierLabels[tier]}
    </span>
  );
}
