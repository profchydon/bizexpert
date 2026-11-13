import { track } from "@/lib/analytics";

export type OfficeAction = "created" | "edited" | "closed" | "employee_added";

export function trackOfficeUpdated(properties: {
  action: OfficeAction;
  office_id?: string;
}): void {
  track("Office Updated", {
    action: properties.action,
    ...(properties.office_id ? { office_id: properties.office_id } : {}),
  });
}
