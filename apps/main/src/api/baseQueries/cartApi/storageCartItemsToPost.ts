import { splitCartLines } from "./splitCartLines";
import type { StorageCartWriteItem } from "./toStorageCartWriteItems";
import type { UnknownCartLine } from "./cartLineTypes";

export function storageCartItemsToPost(
  items: StorageCartWriteItem[],
  cartLines: UnknownCartLine[] | undefined,
): StorageCartWriteItem[] {
  const existing = new Set(
    splitCartLines(cartLines)
      .storage.map((line) => line.equipment_id)
      .filter((id): id is string => Boolean(id)),
  );
  return items.filter((item) => !existing.has(item.equipment_id));
}
