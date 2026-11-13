import assert from "node:assert/strict";
import test from "node:test";
import { IOrder } from "@/types/orders";
import {
  employeeIdsForIntent,
  lineIdsForSubOrder,
  suborderIdsForIntent,
} from "./cancelData";
import type { CancelIntent } from "./cancelTypes";

const order = {
  id: "order-1",
  sub_orders: [
    {
      id: "sub-open",
      employee_id: "emp-open",
      status: "pending",
    },
    {
      id: "sub-other",
      employee_id: "emp-other",
      status: "pending",
    },
  ],
} as unknown as IOrder;

test("suborderIdsForIntent returns undefined for a full-order cancel", () => {
  const intent: CancelIntent = { type: "order" };
  assert.equal(suborderIdsForIntent(order, intent), undefined);
  assert.equal(employeeIdsForIntent(intent), undefined);
});

test("suborderIdsForIntent maps onboarding cancel group keys to sub-order ids", () => {
  const intent: CancelIntent = {
    type: "sub-orders",
    employeeIds: ["sub-open"],
  };
  assert.deepEqual(suborderIdsForIntent(order, intent), ["sub-open"]);
  assert.deepEqual(employeeIdsForIntent(intent), ["sub-open"]);
});

const officeOrder = {
  id: "order-2",
  type: "onboarding",
  sub_orders: [
    {
      id: "ao-1",
      employee_id: null,
      recipient_type: "office",
      office_id: "office-1",
      status: "verification_pending",
      assets: [
        { id: "spec-1", asset_order_id: "ao-1" },
        { id: "spec-2", asset_order_id: "ao-2" },
        { id: "spec-3", asset_order_id: "ao-3" },
      ],
    },
    {
      id: "ao-4",
      employee_id: "emp-1",
      status: "pending",
      assets: [{ id: "spec-4", asset_order_id: "ao-4" }],
    },
  ],
} as unknown as IOrder;

test("cancelling an office row targets every device line in it", () => {
  const intent: CancelIntent = { type: "sub-orders", employeeIds: ["ao-1"] };
  assert.deepEqual(suborderIdsForIntent(officeOrder, intent), [
    "ao-1",
    "ao-2",
    "ao-3",
  ]);
});

test("cancelling office and employee rows together keeps every line once", () => {
  const intent: CancelIntent = {
    type: "sub-orders",
    employeeIds: ["ao-1", "ao-4"],
  };
  assert.deepEqual(suborderIdsForIntent(officeOrder, intent), [
    "ao-1",
    "ao-2",
    "ao-3",
    "ao-4",
  ]);
});

test("cancelling one device in an office row targets only that line", () => {
  const intent: CancelIntent = {
    type: "item",
    employeeId: "ao-1",
    itemId: "spec-2",
  };
  assert.deepEqual(suborderIdsForIntent(officeOrder, intent), ["ao-2"]);
});

test("rows without asset line ids fall back to the row id", () => {
  assert.deepEqual(lineIdsForSubOrder(order.sub_orders[0] as never), [
    "sub-open",
  ]);
});
