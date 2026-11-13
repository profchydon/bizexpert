import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ICart } from "@/types/cart";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import {
  orderSummaryActionType,
  orderSummaryItemDescription,
} from "./orderSummaryCartItemView";

const deployItem = {
  recipientName: "Olu Wale",
  asset: { name: "MB-AIR-M4-7P2L8Q" },
  specification: {
    properties: [
      { name: "Serial", value: "GFGHFHG" },
      { name: "Action", value: "Deploy from storage" },
      { name: "Country", value: "United States" },
    ],
    spec: [],
  },
} as ICart;

describe("orderSummaryCartItemView", () => {
  it("appends the per-item deploy recipient instead of the unassigned stub", () => {
    assert.equal(orderSummaryActionType(deployItem), "Deploy");
    assert.equal(
      orderSummaryItemDescription(deployItem, "United States", {
        id: UNASSIGNED_ORDER_SUMMARY_KEY,
      }),
      "GFGHFHG · → Olu Wale",
    );
  });

  it("does not render a placeholder employee when the recipient is missing", () => {
    const item = { ...deployItem, recipientName: undefined };
    assert.equal(
      orderSummaryItemDescription(item, "United States", {
        id: UNASSIGNED_ORDER_SUMMARY_KEY,
      }),
      "GFGHFHG",
    );
  });
});
