import type { ICart } from "@/types/cart";
import type { IEmployees } from "@/types/employees";

export const OFFICE_RECIPIENT_PREFIX = "office:";

export function officeRecipientKey(
  officeId: string,
  contactEmployeeId: string,
): string {
  return `${OFFICE_RECIPIENT_PREFIX}${officeId}:${contactEmployeeId}`;
}

export function isOfficeRecipient(employee: IEmployees | undefined): boolean {
  if (!employee) return false;
  return (
    employee.destination_type === "office" ||
    String(employee.id || "").startsWith(OFFICE_RECIPIENT_PREFIX)
  );
}

export interface OfficeCheckoutAsset {
  asset_pricing_id: string;
  quantity: number;
  fulfillment_date?: string;
  device_setup?: string;
  note?: string;
}

export interface OfficeCheckoutOrder {
  office_id: string;
  contact_employee_id: string;
  office_country_id: string;
  assets: OfficeCheckoutAsset[];
}

export function checkoutDeviceSetup(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function assetFromCart(
  item: ICart,
  fulfilmentDate?: string,
  note?: string,
): OfficeCheckoutAsset | null {
  const pricingId = item.pricing?.id;
  if (!pricingId) return null;
  const deviceSetup = checkoutDeviceSetup(item.device_setup);
  return {
    asset_pricing_id: pricingId,
    quantity: Number(item.quantity) || 1,
    ...(fulfilmentDate ? { fulfillment_date: fulfilmentDate } : {}),
    ...(deviceSetup ? { device_setup: deviceSetup } : {}),
    ...(note ? { note } : {}),
  };
}

export function splitCheckoutRecipients(employees: IEmployees[]): {
  people: IEmployees[];
  offices: IEmployees[];
} {
  const people: IEmployees[] = [];
  const offices: IEmployees[] = [];
  employees.forEach((employee) => {
    if (isOfficeRecipient(employee)) {
      offices.push(employee);
      return;
    }
    people.push(employee);
  });
  return { people, offices };
}

export function buildOfficeCheckoutOrders(
  employees: IEmployees[],
): OfficeCheckoutOrder[] {
  return employees.flatMap((employee) => {
    if (!isOfficeRecipient(employee) || !employee.office_id) return [];
    const contactId = employee.contact_employee_id || "";
    const countryId = employee.country_id;
    if (!contactId || !countryId) return [];
    const assets = (employee.items ?? [])
      .map((item) =>
        assetFromCart(
          item,
          employee.fulfilment_date,
          employee.note || undefined,
        ),
      )
      .filter((item): item is OfficeCheckoutAsset => Boolean(item));
    if (assets.length === 0) return [];
    return [
      {
        office_id: employee.office_id,
        contact_employee_id: contactId,
        office_country_id: countryId,
        assets,
      },
    ];
  });
}
