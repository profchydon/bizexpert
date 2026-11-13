import { IOrder, ISubOrder } from "@/types/orders";
import { getSubOrders } from "./orderContentLines";

export type StorageNoteGroup = {
  subOrderId: string;
  label: string;
  notes: Record<string, unknown>[];
};

export function getStorageNoteGroups(
  order: IOrder,
  subOrderId?: string | null,
): StorageNoteGroup[] {
  return getSubOrders(order)
    .filter((subOrder) => !subOrderId || subOrder.id === subOrderId)
    .map((subOrder) => ({
      subOrderId: subOrder.id,
      label: formatSubOrderLabel(subOrder),
      notes: Array.isArray((subOrder as { note?: unknown[] }).note)
        ? ((subOrder as { note: Record<string, unknown>[] }).note ?? [])
        : [],
    }))
    .filter((group) => group.notes.length > 0);
}

function formatSubOrderLabel(subOrder: ISubOrder): string {
  const equipment = subOrder.equipment;
  if (!equipment) {
    return "Storage item";
  }

  const title = equipment.title || equipment.make || "Device";
  const model = equipment.model ? ` ${equipment.model}` : "";

  return `${title}${model}`.trim();
}
