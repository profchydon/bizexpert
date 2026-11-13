import type { CancellationScope } from "@/utils/order-cancellation";
import type { RefundExclusion } from "@/utils/refund-preview";
import {
  cancellableItems,
  isDeviceCancellable,
  type CancelEmpRow,
  type CancelEmployeeItem,
} from "./cancelData";
import type { CancelIntent } from "./cancelTypes";
import { itemLineId } from "./cancelLineSelection";
import { plural } from "./cancelScopeCopy";

export type ScopeExclusionReason = "cancelled" | "delivered" | "retrieved";

export interface ScopeLine {
  id: string;
  name: string;
  price: number;
  note: string;
  spent: number;
  excluded: boolean;
  selected?: boolean;
  exclusionReason?: ScopeExclusionReason;
}

export interface ScopePerson {
  id: string;
  name: string;
  meta: string;
  amount: number;
  devices: ScopeLine[];
  charges: ScopeLine[];
  spent: number;
}

export interface CancelScope {
  people: ScopePerson[];
  total: number;
  spent: number;
  exclusion: RefundExclusion;
}

const round = (value: number) => Math.round(value * 100) / 100;

function exclusionReason(
  item: CancelEmployeeItem,
  isOffboarding: boolean,
): ScopeExclusionReason | undefined {
  if (isDeviceCancellable(item)) return undefined;
  if (item.isCancelled) return "cancelled";
  return isOffboarding ? "retrieved" : "delivered";
}

function toDevice(
  item: CancelEmployeeItem,
  isOffboarding: boolean,
  selectedLineIds?: Set<string>,
): ScopeLine {
  const excluded = !isDeviceCancellable(item);
  const reason = exclusionReason(item, isOffboarding);
  const lineId = itemLineId(item);
  return {
    id: lineId,
    name: item.name,
    price: excluded ? 0 : item.price,
    note:
      reason === "cancelled"
        ? "Cancelled"
        : reason === "retrieved"
          ? "Already retrieved"
          : reason === "delivered"
            ? "Already delivered"
            : "Pending",
    spent: 0,
    excluded,
    selected: !excluded && (!selectedLineIds || selectedLineIds.has(lineId)),
    exclusionReason: reason,
  };
}

interface Args {
  employees: CancelEmpRow[];
  intent: CancelIntent;
  item?: CancelEmployeeItem;
  scope: CancellationScope;
  selectedIds: Set<string>;
  isOffboarding: boolean;
  spentBySuborder?: Record<string, number>;
  selectedLineIds?: Set<string>;
}

export function buildCancelScope({
  employees,
  intent,
  item,
  scope,
  selectedIds,
  isOffboarding,
  spentBySuborder = {},
  selectedLineIds,
}: Args): CancelScope {
  const groupIds =
    intent.type === "sub-orders" ? intent.employeeIds : [...selectedIds];
  const affected =
    intent.type === "item" && item
      ? employees.filter((employee) => employee.id === intent.employeeId)
      : intent.type === "sub-orders" || scope.kind === "sub-orders"
        ? employees.filter((employee) => groupIds.includes(employee.id))
        : employees;

  const people: ScopePerson[] = affected.map((employee) => {
    const source =
      intent.type === "item" && item
        ? employee.items.filter((candidate) => candidate.id === item.id)
        : employee.items;
    const devices = source
      .map((candidate) => toDevice(candidate, isOffboarding, selectedLineIds))
      .sort((a, b) => Number(a.excluded) - Number(b.excluded));
    const open = devices.filter((device) => !device.excluded);
    const chosen = open.filter((device) => device.selected);
    const spent = spentBySuborder[employee.employeeId] ?? 0;
    return {
      id: employee.id,
      name: employee.name,
      meta:
        open.length === devices.length
          ? plural(devices.length, "device")
          : `${open.length} of ${devices.length} devices`,
      amount: round(chosen.reduce((sum, row) => sum + row.price, 0)),
      devices,
      charges: [],
      spent: round(spent),
    };
  });

  const allDevices = people.flatMap((person) => person.devices);
  const excludedDevices = allDevices.filter((device) => device.excluded);
  const chosenDevices = allDevices.filter((device) => device.selected);
  const total = round(people.reduce((sum, person) => sum + person.amount, 0));
  const spent = round(people.reduce((sum, person) => sum + person.spent, 0));

  return {
    people,
    total,
    spent,
    exclusion: {
      devices: chosenDevices.length,
      excludedDevices: excludedDevices.length,
      spentServices: spent > 0 ? spent : undefined,
      basis: isOffboarding ? "services" : "hardware",
    },
  };
}
