export type AssetStatus =
  | "assigned"
  | "unassigned"
  | "leased"
  | "in_transit"
  | "on_hold";

export const assetStatusMap: Record<
  AssetStatus,
  { className: string; variant?: string; label: string }
> = {
  assigned: {
    className: "w-fit text-success-700",
    variant: "success",
    label: "Assigned",
  },
  unassigned: {
    className: "w-fit text-gray-700",
    label: "Unassigned",
  },
  leased: {
    className: "w-fit text-primary-700 bg-primary-25",
    label: "Leased",
  },
  in_transit: {
    className: "w-fit bg-purple-50 text-purple-700",
    label: "In Transit",
  },
  on_hold: {
    className: "w-fit bg-warning-50 text-warning-700",
    label: "On Hold",
  },
};
