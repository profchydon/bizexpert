import type {
  EquipDeviceItem,
  EquipEmployeeBasic,
  EquipReviewEmployee,
} from "./equipTypes";

export const buildEquipReview = (
  employees: EquipEmployeeBasic[],
  getItems: (employeeId: string) => EquipDeviceItem[],
): EquipReviewEmployee[] =>
  employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    country: employee.country,
    devices: getItems(employee.id),
  }));

export const reviewToItemsMap = (
  review: EquipReviewEmployee[] | undefined,
): Record<string, EquipDeviceItem[]> =>
  Object.fromEntries(
    (review ?? []).map((employee) => [employee.id, employee.devices]),
  );
