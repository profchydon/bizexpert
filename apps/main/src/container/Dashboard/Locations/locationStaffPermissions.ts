export const LOCATION_STAFF_PERMISSIONS = [
  { key: "canSell", label: "Sell" },
  { key: "canReceiveStock", label: "Receive stock" },
  { key: "canTransferStock", label: "Transfer stock" },
  { key: "canViewAnalytics", label: "View analytics" },
] as const;

export type LocationStaffPermissionKey =
  (typeof LOCATION_STAFF_PERMISSIONS)[number]["key"];

export function locationStaffPermissionLabel(
  key: LocationStaffPermissionKey,
): string {
  return (
    LOCATION_STAFF_PERMISSIONS.find((item) => item.key === key)?.label ?? key
  );
}
