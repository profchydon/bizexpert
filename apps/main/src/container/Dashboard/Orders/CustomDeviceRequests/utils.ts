import { alternativeDevices, countries, rfqDeviceTemplates } from "./constants";
import type {
  CustomDeviceRequest,
  DeviceResponseType,
  RFQDevice,
  RequestStatus,
} from "./types";

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateDeviceName(name: string, maxLength = 32): string {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength)}...`;
}

export function calculateBudgetTotal(
  request: CustomDeviceRequest,
): { total: number; isPartial: boolean } | null {
  const devicesWithPrice = request.devices.filter(
    (device) => device.unitPrice !== undefined,
  );

  if (devicesWithPrice.length === 0) return null;

  const total = devicesWithPrice.reduce(
    (sum, device) => sum + device.quantity * (device.unitPrice ?? 0),
    0,
  );

  const isPartial = devicesWithPrice.length < request.devices.length;
  return { total, isPartial };
}

export function toggleSelectedValue(values: string[], value: string) {
  if (values.includes(value)) {
    return values.filter((current) => current !== value);
  }

  return [...values, value];
}

const requestStatuses: RequestStatus[] = [
  "pending",
  "waiting_for_action",
  "confirmed",
  "rejected",
  "expired",
  "pending",
  "confirmed",
  "waiting_for_action",
  "pending",
  "confirmed",
];

const quoteMultipliers = [
  0.95, 0.92, 0.98, 0.9, 0.97, 0.93, 0.96, 0.91, 0.94, 0.99, 0.88, 0.89, 0.87,
  0.96, 0.93,
];

const responsePatterns: DeviceResponseType[][] = [
  ["quoted"],
  ["quoted", "quoted"],
  ["quoted", "alternative"],
  ["quoted", "unavailable"],
  ["alternative"],
  ["quoted", "quoted", "quoted"],
  ["quoted", "alternative", "quoted"],
  ["quoted", "quoted", "unavailable"],
];

const unavailableReasons = [
  "Out of stock",
  "Discontinued",
  "Not available in this region",
];

const vendorNotes = [
  "Lead time 2-3 weeks. Bulk discount available for 10+ units.",
  "Price valid for 30 days. Includes 1-year standard warranty.",
  "Ships from regional warehouse, delivery within 5 business days.",
  "Extended 3-year warranty available at additional cost.",
  "Currently running a promotion — price includes free setup.",
  "Limited stock, recommend confirming within 7 days.",
  "Includes on-site installation and configuration.",
  "Price reflects enterprise licensing. Volume pricing available.",
];

function hasVendorResponseFor(status: RequestStatus) {
  return ["confirmed", "waiting_for_action", "expired", "rejected"].includes(
    status,
  );
}

function buildVendorResponse(
  shouldIncludeResponse: boolean,
  responseType: DeviceResponseType,
  unitPrice: number | undefined,
  template: (typeof rfqDeviceTemplates)[number],
  i: number,
  j: number,
): RFQDevice["vendorResponse"] {
  if (!shouldIncludeResponse) {
    return undefined;
  }

  if (responseType === "quoted") {
    return {
      type: "quoted",
      quotedPrice: unitPrice
        ? Math.round(
            unitPrice * quoteMultipliers[(i + j) % quoteMultipliers.length],
          )
        : Math.round(template.basePrice * 0.95),
    };
  }

  if (responseType === "alternative") {
    return {
      type: "alternative",
      alternative: alternativeDevices[(i + j) % alternativeDevices.length],
    };
  }

  return {
    type: "unavailable",
    unavailableReason: unavailableReasons[(i + j) % unavailableReasons.length],
  };
}

function calculateRequiredBudget(devices: RFQDevice[]) {
  return devices.reduce((sum, device) => {
    const response = device.vendorResponse;
    if (!response) return sum;

    if (response.type === "quoted" && response.quotedPrice) {
      return sum + response.quotedPrice * device.quantity;
    }

    if (response.type === "alternative" && response.alternative) {
      return sum + response.alternative.price * device.quantity;
    }

    return sum;
  }, 0);
}

function buildDevicesForRequest(
  i: number,
  numDevices: number,
  hasBudget: boolean,
  hasVendorResponse: boolean,
) {
  const devices: RFQDevice[] = [];
  const responsePattern = responsePatterns[i % responsePatterns.length];

  for (let j = 0; j < numDevices; j += 1) {
    const template =
      rfqDeviceTemplates[(i + j * 3) % rfqDeviceTemplates.length];
    const quantity = (i % 5) + 1;
    const deviceHasBudget = hasBudget || (j === 0 && i % 4 !== 0);
    const unitPrice = deviceHasBudget
      ? template.basePrice + ((i * 50) % 500)
      : undefined;

    const responseType = responsePattern[j % responsePattern.length];
    const vendorResponse = buildVendorResponse(
      hasVendorResponse,
      responseType,
      unitPrice,
      template,
      i,
      j,
    );

    devices.push({
      name: template.name,
      quantity,
      unitPrice,
      assetType: template.assetType,
      description: `High-quality ${template.assetType.toLowerCase()} for professional use.`,
      vendorResponse,
    });
  }

  return devices;
}

export function generateCustomDeviceRequests(
  count: number,
): CustomDeviceRequest[] {
  const requests: CustomDeviceRequest[] = [];
  const baseId = 26700;

  for (let i = 0; i < count; i += 1) {
    const numDevices = (i % 3) + 1;
    const hasBudget = i % 3 !== 0;
    const status = requestStatuses[i % requestStatuses.length];
    const hasVendorResponse = hasVendorResponseFor(status);
    const devices = buildDevicesForRequest(
      i,
      numDevices,
      hasBudget,
      hasVendorResponse,
    );

    const requestBudget = devices.reduce(
      (sum, device) => sum + (device.unitPrice ?? 0) * device.quantity,
      0,
    );

    let requiredBudget: number | undefined;
    if (hasVendorResponse) {
      requiredBudget = calculateRequiredBudget(devices);
    }

    const dayOffset = i * 2;
    const createdAt = `Jan ${(dayOffset % 28) + 1}, 2025`;
    const expiresAt = `Jan ${((dayOffset + 5) % 28) + 1}, 2025`;

    requests.push({
      rfqId: String(baseId + i) + "-rfq",
      id: String(baseId + i),
      devices,
      requestBudget,
      requiredBudget,
      country: countries[i % countries.length],
      status,
      createdAt,
      expiresAt,
      vendorNote:
        hasVendorResponse && i % 3 !== 0
          ? vendorNotes[i % vendorNotes.length]
          : undefined,
    });
  }

  return requests;
}

export const customDeviceRequests = generateCustomDeviceRequests(50);
