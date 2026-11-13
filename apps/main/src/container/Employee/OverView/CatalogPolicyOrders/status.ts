import type { BadgeProps } from "@/components/ui/badge";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export function getCatalogPolicyOrderStatusMeta(
  request: CatalogOrderRequestApi,
): { label: string; variant: BadgeVariant } {
  const rfqStatuses = (request.rfqs ?? []).map((rfq) =>
    rfq.status?.toLowerCase(),
  );

  if (rfqStatuses.includes("accepted")) {
    return { label: "RFQ accepted", variant: "success" };
  }

  if (
    rfqStatuses.includes("approved") ||
    rfqStatuses.includes("waiting_for_action")
  ) {
    return { label: "RFQ quote ready", variant: "blue" };
  }

  if (rfqStatuses.includes("pending")) {
    return { label: "Awaiting RFQ response", variant: "destructive" };
  }

  const status = request.status?.toLowerCase();
  if (status === "approved") return { label: "Approved", variant: "success" };
  if (status === "rejected") return { label: "Rejected", variant: "mild" };
  if (["awaiting_rfq", "pending_rfq", "rfq"].includes(status ?? "")) {
    return { label: "Awaiting RFQ", variant: "blue" };
  }

  return { label: titleCaseStatus(status), variant: "pending" };
}

function titleCaseStatus(status?: string | null) {
  if (!status) return "Pending";
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
