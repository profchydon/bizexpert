import type { BadgeColors } from "@/components/base/badges/badge-types";
import type { REFRESH_ASSET_STATUS } from "@/types/assetRefresh";

type WarrantyPresentation = {
  color: BadgeColors;
  label: string;
  tooltip: string;
  description?: string;
  caption?: string;
  captionTone: string;
  captionIcon: "calendar" | "shield";
};

const NOT_COVERED: WarrantyPresentation = {
  color: "gray",
  label: "Not covered",
  tooltip: "No refresh or warranty tracking is configured for this device.",
  caption: "Not covered",
  captionTone: "text-quaternary",
  captionIcon: "shield",
};

export const getRefreshWarrantyPresentation = (
  status?: REFRESH_ASSET_STATUS | null,
  monthsTillDue?: string | null,
): WarrantyPresentation => {
  if (!status) return NOT_COVERED;

  const remaining = monthsTillDue?.trim();

  if (status === "Due") {
    return {
      color: "warning",
      label: "Due",
      tooltip: "This device is due for refresh.",
      description: remaining ? `${remaining} remaining` : undefined,
      caption: remaining ? `Due in ${remaining}` : "Due for refresh",
      captionTone: "text-warning-primary",
      captionIcon: "calendar",
    };
  }

  if (status === "Overdue") {
    return {
      color: "error",
      label: "Overdue",
      tooltip: "This device is overdue for refresh.",
      description: remaining ? `${remaining} overdue` : undefined,
      caption: remaining ? `Overdue by ${remaining}` : "Overdue for refresh",
      captionTone: "text-error-primary",
      captionIcon: "calendar",
    };
  }

  return {
    color: "gray",
    label: "Not Due",
    tooltip: "This device is not yet due for refresh.",
    description: remaining ? `${remaining} remaining` : undefined,
    caption: remaining ? `${remaining} remaining` : "Not due yet",
    captionTone: "text-tertiary",
    captionIcon: "calendar",
  };
};
