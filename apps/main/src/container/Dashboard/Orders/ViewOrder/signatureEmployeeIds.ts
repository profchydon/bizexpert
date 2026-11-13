import { ISubOrder } from "@/types/orders";

export const SIGNATURE_ENABLED_MESSAGE =
  "Signature on delivery has been enabled for this order. Delivery will be attempted when the recipient is available, but this cannot always be guaranteed.";

interface Options {
  storageFallback?: boolean;
}

export function collectSignatureEmployeeIds(
  rows: ISubOrder[],
  { storageFallback = false }: Options = {},
) {
  const reassignRows = rows.filter((row) => row.type === "reassign");
  const nonReassignRows = rows.filter((row) => row.type !== "reassign");

  const nonReassignEmployeeIds = nonReassignRows
    .map((row) =>
      storageFallback && row?.type === "storage"
        ? row?.equipment?.assignee?.id || ""
        : row.employee_id,
    )
    .filter(Boolean);

  const reassignEmployeeIds = reassignRows
    .map((row) => (row.order_details as any)?.to?.id)
    .filter(Boolean) as string[];

  return { nonReassignEmployeeIds, reassignEmployeeIds };
}
