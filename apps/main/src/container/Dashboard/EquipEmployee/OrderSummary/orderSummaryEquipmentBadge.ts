import type { BadgeProps } from "@/components/ui/badge";

const DISPOSE_TYPES = new Set(["dispose", "archive", "disposal"]);

const CHECK_TYPES = new Set(["device_check", "device check"]);

const DEPLOY_TYPES = new Set(["deploy", "deployment", "deploy from storage"]);

export function equipmentBadgeVariant(
  actionType?: string,
  isStorage?: boolean,
): BadgeProps["variant"] {
  const value = actionType?.toLowerCase();
  if (value && DISPOSE_TYPES.has(value)) return "pending";
  if (value && CHECK_TYPES.has(value)) return "gray";
  if (value && DEPLOY_TYPES.has(value)) return "blue";
  return isStorage ? "gray" : "blue";
}

export function equipmentBadgeLabel(actionType?: string, isStorage?: boolean) {
  if (!actionType) return isStorage ? "In storage" : "Onboard";
  const value = actionType.toLowerCase();
  if (DISPOSE_TYPES.has(value)) return "Dispose";
  if (CHECK_TYPES.has(value)) return "Device check";
  if (DEPLOY_TYPES.has(value)) return "Deploy";
  return actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase();
}
