import type {
  EquipEmployeeInitiateOrder,
  EquipEmployeeInitiateAsset,
  EquipEmployeeInitiateEquipment,
} from "@/api/baseQueries/companiesApi/transactionsApi/equipEmployeePayment";
import type { IEmployees } from "@/types/employees";
import type {
  DeviceConfig,
  EquipDeviceItem,
  EquipReviewEmployee,
} from "./equipTypes";
import {
  resolveEmployeeCountryId,
  type CountryOption,
} from "./resolveEmployeeCountryId";

const deviceSetup = (config: DeviceConfig): string | undefined =>
  config === "none" ? undefined : config;

interface OrderOptions {
  includeDeviceSetup?: boolean;
  includeFulfilmentDate?: boolean;
  signatureRequested?: boolean;
  note?: string;
}

const deviceCommonFields = (
  device: EquipDeviceItem,
  options: OrderOptions,
): {
  device_setup?: string;
  fulfillment_date?: string;
  signature_requested?: boolean;
  note?: string;
} => {
  const setup = options.includeDeviceSetup
    ? deviceSetup(device.config)
    : undefined;
  const fulfilmentDate = options.includeFulfilmentDate
    ? device.fulfilmentDate
    : undefined;
  return {
    ...(setup ? { device_setup: setup } : {}),
    ...(fulfilmentDate ? { fulfillment_date: fulfilmentDate } : {}),
    ...(options.signatureRequested ? { signature_requested: true } : {}),
    ...(options.note ? { note: options.note } : {}),
  };
};

const buildOrder = (
  devices: EquipDeviceItem[],
  employeeCountryId: string,
  options: OrderOptions,
): EquipEmployeeInitiateOrder | null => {
  const assets: EquipEmployeeInitiateAsset[] = devices
    .filter(
      (device) =>
        device.source !== "STORAGE" && device.asset?.asset_pricing?.id,
    )
    .map((device) => ({
      asset_pricing_id: device.asset!.asset_pricing!.id!,
      quantity: device.quantity,
      ...deviceCommonFields(device, options),
    }));

  const equipment: EquipEmployeeInitiateEquipment[] = devices
    .filter(
      (device) => device.source === "STORAGE" && Boolean(device.productId),
    )
    .map((device) => ({
      equipment_id: device.productId,
      quantity: device.quantity,
      ...deviceCommonFields(device, options),
    }));

  if (assets.length === 0 && equipment.length === 0) return null;

  const order: EquipEmployeeInitiateOrder = {
    employee_country_id: employeeCountryId,
  };
  if (assets.length > 0) order.assets = assets;
  if (equipment.length > 0) order.equipment = equipment;
  return order;
};

interface BuildOrdersArgs {
  review: EquipReviewEmployee[];
  equipEmployees: IEmployees[] | undefined;
  countries: CountryOption[];
  options?: OrderOptions;
}

export const buildEquipEmployeeOrders = ({
  review,
  equipEmployees,
  countries,
  options = {},
}: BuildOrdersArgs): Record<string, EquipEmployeeInitiateOrder> => {
  const fullById = new Map(
    (equipEmployees ?? []).map((employee) => [String(employee.id), employee]),
  );

  const orders: Record<string, EquipEmployeeInitiateOrder> = {};
  review.forEach((reviewEmployee) => {
    const full = fullById.get(String(reviewEmployee.id));
    const employeeCountryId =
      resolveEmployeeCountryId(full, countries) ?? full?.country_id;
    if (!employeeCountryId) return;

    const order = buildOrder(
      reviewEmployee.devices,
      employeeCountryId,
      options,
    );
    if (order) orders[reviewEmployee.id] = order;
  });

  return orders;
};
