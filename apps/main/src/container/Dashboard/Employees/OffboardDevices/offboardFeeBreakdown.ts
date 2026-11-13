import {
  buildFeeRows,
  type FeeRow,
  type FeeSummaryLike,
  type TaxDisplayLabels,
} from "@/lib/tax/feeSummary";
import type { DeviceLine } from "@/types/offboard";
import type { TaxDisplayMode } from "@/types/tax";

export interface OffboardFeeEquipment {
  equipment_id: string;
  quantity: number;
  storage?: boolean;
  reassign?: boolean;
  dispose?: boolean;
  factory_reset?: boolean;
}

export interface OffboardFeeBreakdown {
  rows: FeeRow[];
  feeSummary: FeeSummaryLike | undefined;
  total: number;
  deviceCount: number;
  currencySymbol: string;
}

export const buildOffboardFeeEquipment = (
  lines: DeviceLine[],
): OffboardFeeEquipment[] =>
  lines.map((line) => {
    const equipment: OffboardFeeEquipment = {
      equipment_id: line.equipmentId || line.id,
      quantity: 1,
    };

    if (line.disposition === "STORE") equipment.storage = true;
    else if (line.disposition === "REASSIGN") equipment.reassign = true;
    else if (line.disposition === "DISPOSE") equipment.dispose = true;

    if (line.wipeType === "Full Factory Reset") equipment.factory_reset = true;

    return equipment;
  });

const readFeeSummary = (feeData: unknown): FeeSummaryLike | undefined => {
  if (!feeData || typeof feeData !== "object") return undefined;
  const summary = (feeData as Record<string, unknown>).fee_summary;
  if (!summary || typeof summary !== "object") return undefined;
  return summary as FeeSummaryLike;
};

export const extractOffboardFeeBreakdown = (
  feeData: unknown,
  deviceCount: number,
  taxMode: TaxDisplayMode = "inclusive",
  taxLabels?: TaxDisplayLabels,
): OffboardFeeBreakdown => {
  const feeSummary = readFeeSummary(feeData);

  return {
    rows: buildFeeRows(feeSummary, taxMode, taxLabels),
    feeSummary,
    total: Number(feeSummary?.total_fee ?? 0),
    deviceCount,
    currencySymbol: feeSummary?.currency?.symbol ?? "$",
  };
};

export const extractAggregateOffboardFeeBreakdown = extractOffboardFeeBreakdown;

export const buildOffboardFeeOrders = (
  employees: { id: string; devices: DeviceLine[] }[],
): Record<string, { equipment: OffboardFeeEquipment[] }> => {
  const orders: Record<string, { equipment: OffboardFeeEquipment[] }> = {};

  employees.forEach((employee) => {
    const equipment = buildOffboardFeeEquipment(employee.devices);
    if (equipment.length > 0) orders[employee.id] = { equipment };
  });

  return orders;
};

export const extractEmployeeServiceFee = (
  feeData: unknown,
  employeeId: string,
): number | null => {
  if (!feeData || typeof feeData !== "object") return null;
  const employee = (feeData as Record<string, unknown>)[employeeId];
  if (!employee || typeof employee !== "object") return null;
  const fees = (employee as Record<string, unknown>).fees;
  if (!fees || typeof fees !== "object") return null;
  const total = Number((fees as Record<string, unknown>).total_fee);
  return Number.isFinite(total) ? total : null;
};

export const buildOffboardFeesRequest = ({
  companyId,
  countryId,
  employeeId,
  lines,
}: {
  companyId?: string | null;
  countryId?: string | null;
  employeeId: string;
  lines: DeviceLine[];
}) => {
  const equipment = buildOffboardFeeEquipment(lines);
  if (!companyId || !countryId || !employeeId || equipment.length === 0) {
    return undefined;
  }

  return {
    companyId,
    service_type: "Offboarding" as const,
    payment_method: "Credit" as const,
    country_id: countryId,
    orders: { [employeeId]: { equipment } },
  };
};

export const formatFeeAmount = (amount: number, symbol: string): string =>
  `${symbol}${Number(amount || 0).toLocaleString("en-US")}`;
