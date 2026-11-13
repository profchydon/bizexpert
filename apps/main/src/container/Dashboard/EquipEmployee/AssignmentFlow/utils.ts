import { ICart } from "@/types/cart";
import { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { resolveCountryText } from "@/utils/resolveCountryText";
import { AssignmentUnit, EmployeeOption } from "./types";

const createAssignmentUnits = (carts: ICart[]): AssignmentUnit[] => {
  const units: AssignmentUnit[] = [];

  carts.forEach((cart) => {
    Array.from({ length: cart.quantity }).forEach((_, index) => {
      units.push({
        unitId: `${cart.pricing.id}-${index + 1}`,
        cartItem: { ...cart, quantity: 1 },
        destination: { type: "storage" },
      });
    });
  });

  return units;
};

const groupByEmployee = (
  units: AssignmentUnit[],
  employees: EmployeeOption[],
  fulfilmentDatesByEmployee: Record<string, string> = {},
  deviceSetupsByUnit: Record<string, string> = {},
  offices: Array<{
    id: string;
    name: string;
    address?: string;
    region: string;
    countryId?: string;
  }> = [],
) => {
  const grouped = new Map<string, { employee: IEmployees; items: ICart[] }>();
  const groupDates = { ...fulfilmentDatesByEmployee };

  units.forEach((unit) => {
    let key = UNASSIGNED_ORDER_SUMMARY_KEY;
    let employee: IEmployees | undefined = {
      id: UNASSIGNED_ORDER_SUMMARY_KEY,
    } as unknown as IEmployees;
    const destination = unit.destination;

    if (destination.type === "employee") {
      key = destination.employeeId;
      employee = employees.find(
        (item) => item.id === destination.employeeId,
      )?.raw;
    }

    if (destination.type === "office") {
      key = `office:${destination.officeId}:${destination.contactEmployeeId}`;
      const office = offices.find((item) => item.id === destination.officeId);
      const [firstName, ...rest] = destination.contactEmployeeName.split(" ");
      employee = {
        id: key,
        first_name: firstName || destination.contactEmployeeName,
        last_name: rest.join(" "),
        address: office?.address || "",
        country: office?.region,
        country_id: office?.countryId || "",
        office_id: destination.officeId,
        office: { id: destination.officeId, name: destination.officeName },
        destination_type: "office",
        contact_employee_id: destination.contactEmployeeId,
      } as IEmployees;
    }

    if (!employee) {
      return;
    }
    const deviceSetup = deviceSetupsByUnit[unit.unitId];
    const unitDate = fulfilmentDatesByEmployee[unit.unitId];
    if (unitDate && !groupDates[key]) {
      groupDates[key] = unitDate;
    }

    const existing = grouped.get(key);
    if (existing) {
      const found = existing.items.find(
        (item) =>
          item.pricing.id === unit.cartItem.pricing.id &&
          item.device_setup === deviceSetup,
      );
      if (found) {
        found.quantity += 1;
        found.device_setup = deviceSetup;
      } else {
        existing.items.push({
          ...unit.cartItem,
          quantity: 1,
          storage: destination.type === "storage" ? true : undefined,
          device_setup: deviceSetup,
        });
      }
      return;
    }

    grouped.set(key, {
      employee,
      items: [
        {
          ...unit.cartItem,
          quantity: 1,
          storage: destination.type === "storage" ? true : undefined,
          device_setup: deviceSetup,
        },
      ],
    });
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item.employee,
    fulfilment_date: groupDates[String(item.employee.id)] || undefined,
    items: item.items,
  }));
};

const mapEmployeeOptions = (data: IEmployees[] = []): EmployeeOption[] => {
  return data.map((employee) => ({
    id: String(employee.id),
    name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
    countryCode: resolveCountryText(employee.country_code),
    countryName: resolveCountryText(employee.country),
    raw: employee,
  }));
};

const normalizeCountry = (value?: unknown) =>
  (resolveCountryText(value) || "").toLowerCase();

const countryMatchTargets = (countryLabel?: string, countryCode?: string) =>
  [countryLabel, countryCode].map(normalizeCountry).filter(Boolean);

const isEmployeeInCountry = (
  employee: EmployeeOption,
  countryLabel?: string,
  countryCode?: string,
) => {
  const targets = countryMatchTargets(countryLabel, countryCode);
  if (targets.length === 0) {
    return true;
  }

  const employeeName = normalizeCountry(employee.countryName);
  const employeeCode = normalizeCountry(employee.countryCode);

  return targets.some(
    (target) => target === employeeName || target === employeeCode,
  );
};

const hasCountryEmployees = (
  employees: EmployeeOption[],
  countryLabel?: string,
  countryCode?: string,
) => {
  return employees.some((employee) =>
    isEmployeeInCountry(employee, countryLabel, countryCode),
  );
};

export {
  createAssignmentUnits,
  groupByEmployee,
  hasCountryEmployees,
  isEmployeeInCountry,
  mapEmployeeOptions,
};
