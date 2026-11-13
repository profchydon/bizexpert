import { AlertCircle, CheckCircle, Clock3, XCircle } from "lucide-react";
import type { CustomDeviceRequest } from "../types";

interface RequestStatusBannerProps {
  request: CustomDeviceRequest;
  hasUnavailableItems: boolean;
}

export default function RequestStatusBanner({
  request,
  hasUnavailableItems,
}: Readonly<RequestStatusBannerProps>) {
  const banners = {
    accepted: {
      color: "text-success-700",
      description: "Your order has been confirmed and is being processed.",
      icon: CheckCircle,
      styles: "border-success-200 bg-success-50",
      title: "Order Confirmed",
    },
    confirmed: {
      color: "text-success-700",
      description: "Your order has been confirmed and is being processed.",
      icon: CheckCircle,
      styles: "border-success-200 bg-success-50",
      title: "Order Confirmed",
    },
    expired: {
      color: "text-gray-600",
      description:
        "This quote was not confirmed or declined within 7 days and has expired. Please submit a new request if you still need these items.",
      icon: Clock3,
      styles: "border-gray-200 bg-gray-50",
      title: "Quote Expired",
    },
    pending: {
      color: "text-warning-700",
      description:
        "Your request has been sent to vendors. You will be notified when a quote is available.",
      icon: Clock3,
      styles: "border-warning-200 bg-warning-50",
      title: "Pending Vendor Response",
    },
    rejected: {
      color: "text-gray-600",
      description:
        "You have rejected this quote. You can submit a new request if needed.",
      icon: XCircle,
      styles: "border-gray-200 bg-gray-50",
      title: "Quote Rejected",
    },
    waiting_for_action: hasUnavailableItems
      ? {
          color: "text-error-700",
          description:
            "The vendor cannot fulfill all requested items. Review the quote below for details.",
          icon: AlertCircle,
          styles: "border-error-200 bg-error-50",
          title: "Some Items Unavailable",
        }
      : null,
  } as const;

  const banner = banners[request.status];
  if (!banner) return null;

  const Icon = banner.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${banner.styles}`}
    >
      <Icon className={`size-5 shrink-0 ${banner.color}`} />
      <div className={`flex flex-col gap-1 ${banner.color}`}>
        <span className="text-sm font-semibold">{banner.title}</span>
        <span className="text-sm">{banner.description}</span>
      </div>
    </div>
  );
}
