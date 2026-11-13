import React from "react";
import { IOrder } from "@/types/orders";
import { OrderNoteActivity } from "@/components/Drawers/IndividualEmployee/OrderNoteActivity";
import { getStorageNoteGroups } from "./storageOrderNotes";

interface Props {
  order: IOrder;
  subOrderId?: string | null;
  focusedNoteIndex?: number | null;
}

const StorageOrderNotesV2: React.FC<Props> = ({
  order,
  subOrderId,
  focusedNoteIndex,
}) => {
  const groups = getStorageNoteGroups(order, subOrderId);
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 border-t border-gray-200 pt-5">
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-gray-900">Order notes</h4>
        <p className="text-sm text-gray-500">
          Notes added by Rayda about this storage order.
        </p>
      </div>
      {groups.map((group) => (
        <div key={group.subOrderId} className="flex flex-col gap-3">
          {groups.length > 1 && (
            <p className="text-sm font-medium text-gray-700">{group.label}</p>
          )}
          <OrderNoteActivity
            notes={group.notes}
            focusedNoteIndex={
              !subOrderId || group.subOrderId === subOrderId
                ? focusedNoteIndex
                : null
            }
          />
        </div>
      ))}
    </div>
  );
};

export default StorageOrderNotesV2;
