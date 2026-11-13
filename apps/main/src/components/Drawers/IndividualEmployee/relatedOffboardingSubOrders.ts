import { ISubOrder } from "@/types/orders";

function resolveEmployeeId(subOrder: ISubOrder): string {
  const details = subOrder.order_details as
    | { from?: { id?: string } }
    | undefined;
  return (
    subOrder.employee_id ||
    (subOrder as { user_id?: string }).user_id ||
    details?.from?.id ||
    subOrder.equipment?.assignee?.id ||
    subOrder.id
  );
}

export function relatedOffboardingSubOrders(
  order: { type?: string; sub_orders?: ISubOrder[] | { data?: ISubOrder[] } },
  subOrder: ISubOrder | undefined,
): ISubOrder[] {
  if (!subOrder || order.type !== "offboarding") {
    return subOrder ? [subOrder] : [];
  }

  const raw = order.sub_orders;
  const all = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const employeeId = resolveEmployeeId(subOrder);

  return all.filter((row) => resolveEmployeeId(row) === employeeId);
}
