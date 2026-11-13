"use client";

import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  REFRESH_ASSET_STATUS,
  refrshAssetStatusMap,
} from "@/types/assetRefresh";
import { OrderFlowType, orderFlowTypeCheck } from "@/types/offboarding";
import { signatureStatusMap } from "@/utils/signatureStatusMap";

type EquipmentStatusKey =
  | "assigned"
  | "in_storage"
  | "in_transit"
  | "pending_pickup"
  | "leased"
  | "unassigned"
  | "awaiting_assignment"
  | "request_sale"
  | "request_storage"
  | "sold"
  | "archived"
  | "under_repair"
  | "faulty";

const EQUIPMENT_STATUS: Record<
  EquipmentStatusKey,
  {
    label: string;
    color: "success" | "gray" | "warning" | "purple" | "brand" | "error";
  }
> = {
  assigned: { label: "Assigned", color: "brand" },
  in_storage: { label: "In Storage", color: "gray" },
  in_transit: { label: "In Transit", color: "gray" },
  pending_pickup: { label: "Pending Pickup", color: "warning" },
  leased: { label: "Leased", color: "brand" },
  unassigned: { label: "Unassigned", color: "purple" },
  awaiting_assignment: { label: "Awaiting Assignment", color: "purple" },
  request_sale: { label: "Request Sale", color: "purple" },
  request_storage: { label: "Request Storage", color: "purple" },
  sold: { label: "Sold", color: "warning" },
  archived: { label: "Archived", color: "gray" },
  under_repair: { label: "Under Repair", color: "warning" },
  faulty: { label: "Faulty", color: "error" },
};

const ORDER_TYPE_COLOR: Record<
  OrderFlowType,
  "success" | "gray" | "purple" | "blue"
> = {
  onboarding: "success",
  offboarding: "gray",
  storage_to_employee: "blue",
  buy_to_storage: "purple",
  renew_storage: "blue",
  device_refresh: "gray",
  storage: "blue",
  storage_order: "blue",
};

export function EquipmentAssetStatusBadge({ status }: { status?: string }) {
  const key = status?.toLowerCase() as EquipmentStatusKey;
  const config = EQUIPMENT_STATUS[key];
  if (!config) return null;
  return (
    <Badge color={config.color} size="sm" type="pill-color">
      {config.label}
    </Badge>
  );
}

export function RefreshStatusBadge({
  status,
}: {
  status?: REFRESH_ASSET_STATUS;
}) {
  if (!status) {
    return (
      <Badge color="error" size="sm" type="pill-color">
        Not available
      </Badge>
    );
  }
  const config = refrshAssetStatusMap[status];
  const color =
    status === "Overdue" ? "error" : status === "Due" ? "warning" : "gray";
  return (
    <Badge color={color} size="sm" type="pill-color">
      {config.label}
    </Badge>
  );
}

export function EmployeeOrderTypeBadge({ type }: { type?: OrderFlowType }) {
  if (!type || !orderFlowTypeCheck[type]?.label) return null;
  const color = ORDER_TYPE_COLOR[type] ?? "success";
  return (
    <Tooltip title={orderFlowTypeCheck[type].label} placement="top">
      <TooltipTrigger className="cursor-default">
        <Badge color={color} size="sm" type="pill-color">
          {orderFlowTypeCheck[type].label}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );
}

export function EmployeeSignatureBadge({
  signatureRequired,
}: {
  signatureRequired?: string | boolean;
}) {
  const badge =
    signatureStatusMap[signatureRequired as keyof typeof signatureStatusMap] ??
    signatureStatusMap.not_requested;
  const color = badge.label === "Not required" ? "gray" : "blue";
  return (
    <Badge color={color} size="sm" type="pill-color">
      {badge.label}
    </Badge>
  );
}
