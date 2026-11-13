import type { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export type StorageCartPerson = {
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export function storageCartEmployeeName(
  employee?: StorageCartPerson | null,
): string | undefined {
  if (!employee) return undefined;
  const fromParts = [employee.first_name, employee.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const name = employee.name?.trim() || fromParts || employee.email?.trim();
  return name || undefined;
}

export function deployRecipientArrow(name?: string): string {
  return name ? ` · → ${name}` : "";
}

export function orderSummaryEmployeeName(
  employee?: StorageCartPerson & {
    id?: string;
    personal_email?: string | null;
  },
): string | undefined {
  if (!employee || employee.id === UNASSIGNED_ORDER_SUMMARY_KEY) {
    return undefined;
  }
  return storageCartEmployeeName({
    name: employee.name,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email || employee.personal_email || undefined,
  });
}

export function applyStorageDeployRecipients(
  employees: IEmployees[],
  actionItems?: CheckoutItem[],
): IEmployees[] {
  if (!actionItems?.length) return employees;
  const byLineId = new Map(actionItems.map((item) => [item.id, item]));
  const byDeviceId = new Map(actionItems.map((item) => [item.deviceId, item]));

  return employees.map((employee) => ({
    ...employee,
    items: employee.items?.map((item) => {
      const match =
        (item.pricing?.id ? byLineId.get(item.pricing.id) : undefined) ||
        (item.equipmentId ? byDeviceId.get(item.equipmentId) : undefined);
      if (!match) return item;
      return {
        ...item,
        recipientName: item.recipientName || match.recipientName,
        recipientCountry: item.recipientCountry || match.recipientCountry,
        employeeId: item.employeeId || match.employeeId,
      };
    }),
  }));
}
