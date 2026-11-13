import type { ApprovalCounts } from "../utils";
import { CheckCircle, Hourglass02, Star01, XClose } from "./UntitledIcons";

export function ApprovalsCountStrip({ counts }: { counts: ApprovalCounts }) {
  const tiles = [
    {
      label: "Awaiting your review",
      value: counts.awaiting,
      icon: Hourglass02,
      tone: "warning",
    },
    {
      label: "Pending RFQ",
      value: counts.rfq,
      icon: Star01,
      tone: "warning",
    },
    {
      label: "Approved last 7 days",
      value: counts.approved,
      icon: CheckCircle,
      tone: "success",
    },
    {
      label: "Rejected last 7 days",
      value: counts.rejected,
      icon: XClose,
      tone: "gray",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ icon: Icon, label, tone, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <span className={featuredIconClassName(tone)}>
            <Icon size={20} />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-gray-600">
              {label}
            </span>
            <span className="text-2xl font-semibold tabular-nums text-gray-900">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function featuredIconClassName(tone: string) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";
  if (tone === "success") return `${base} bg-success-50 text-success-600`;
  if (tone === "error") return `${base} bg-error-50 text-error-600`;
  if (tone === "warning") return `${base} bg-warning-50 text-warning-600`;
  return `${base} bg-gray-100 text-gray-600`;
}
