import type { CancellationScope } from "@/utils/order-cancellation";
import type { CancelEmpRow, CancelEmployeeItem } from "./cancelData";
import { isDeviceCancellable } from "./cancelData";
import type { CancelIntent } from "./cancelTypes";

export type LineSelectionState = "all" | "some" | "none";

export function itemLineId(item: CancelEmployeeItem): string {
  return item.lineId || item.id;
}

function employeesForIntent(
  employees: CancelEmpRow[],
  intent: CancelIntent,
): CancelEmpRow[] {
  if (intent.type === "sub-orders") {
    return employees.filter((employee) =>
      intent.employeeIds.includes(employee.id),
    );
  }
  if (intent.type === "item") {
    return employees.filter((employee) => employee.id === intent.employeeId);
  }
  return employees;
}

export function cancellableLineIds(
  employees: CancelEmpRow[],
  intent: CancelIntent,
): string[] {
  return employeesForIntent(employees, intent).flatMap((employee) =>
    employee.items
      .filter((item) => {
        if (intent.type === "item" && item.id !== intent.itemId) return false;
        return isDeviceCancellable(item);
      })
      .map(itemLineId),
  );
}

export function lineSelectionState(
  selectable: string[],
  selected: string[],
): LineSelectionState {
  const chosen = selectable.filter((id) => selected.includes(id));
  if (chosen.length === 0) return "none";
  if (chosen.length === selectable.length) return "all";
  return "some";
}

export function cancellationScopeForLines(args: {
  intent: CancelIntent;
  itemId?: string;
  coversEverything: boolean;
  employeeIds: string[];
  selectable: string[];
  selected: string[];
}): CancellationScope {
  const allSelected =
    args.selectable.length > 0 &&
    args.selectable.every((id) => args.selected.includes(id));
  if (!allSelected) return { kind: "items", itemIds: args.selected };
  if (args.intent.type === "item" && args.itemId) {
    return { kind: "items", itemIds: [args.itemId] };
  }
  if (args.intent.type === "sub-orders" && !args.coversEverything) {
    return { kind: "sub-orders", employeeIds: args.employeeIds };
  }
  return { kind: "full" };
}

export function cancelRequestIds(
  employees: CancelEmpRow[],
  selectedLineIds: string[],
): { employeeIds?: string[]; suborderIds?: string[] } {
  const selected = new Set(selectedLineIds);
  const employeeIds: string[] = [];
  const suborderIds: string[] = [];

  employees.forEach((employee) => {
    const lines = employee.items
      .filter(
        (item) => isDeviceCancellable(item) && selected.has(itemLineId(item)),
      )
      .map(itemLineId);
    if (!lines.length) return;
    employeeIds.push(employee.id);
    suborderIds.push(...lines);
  });

  return {
    employeeIds: employeeIds.length ? employeeIds : undefined,
    suborderIds: suborderIds.length ? suborderIds : undefined,
  };
}
