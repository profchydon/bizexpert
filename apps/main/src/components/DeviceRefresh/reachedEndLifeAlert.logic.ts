import { removeUserscore } from "@/utils/underScoreTransformer";

export const isAssignedEquipmentStatus = (status: string): boolean =>
  status?.toLowerCase() === "assigned";

export const getRefreshBlockedMessage = (status: string): string => {
  if (isAssignedEquipmentStatus(status)) return "";
  const label = removeUserscore(status)?.toLowerCase() ?? "this status";
  return `Cannot refresh a device that is ${label}.`;
};
