import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IOrder } from "@/types/orders";
import { getStorageNoteGroups } from "./storageOrderNotes";

describe("getStorageNoteGroups", () => {
  it("returns note groups for storage sub orders", () => {
    const order = {
      sub_orders: [
        {
          id: "sub-1",
          equipment: { title: "MacBook", model: "Pro" },
          note: [{ author: "Admin", note: "Handle with care" }],
        },
      ],
    } as IOrder;

    assert.deepEqual(getStorageNoteGroups(order), [
      {
        subOrderId: "sub-1",
        label: "MacBook Pro",
        notes: [{ author: "Admin", note: "Handle with care" }],
      },
    ]);
  });

  it("filters to a deep-linked sub order id", () => {
    const order = {
      sub_orders: [
        {
          id: "sub-1",
          equipment: { title: "MacBook" },
          note: [{ author: "Admin", note: "First" }],
        },
        {
          id: "sub-2",
          equipment: { title: "Dell" },
          note: [{ author: "Admin", note: "Second" }],
        },
      ],
    } as IOrder;

    assert.deepEqual(getStorageNoteGroups(order, "sub-2"), [
      {
        subOrderId: "sub-2",
        label: "Dell",
        notes: [{ author: "Admin", note: "Second" }],
      },
    ]);
  });
});
