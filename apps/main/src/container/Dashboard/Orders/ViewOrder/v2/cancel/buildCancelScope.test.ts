import assert from "node:assert/strict";
import test from "node:test";
import { IOrder } from "@/types/orders";
import { buildCancelEmployees } from "./cancelData";
import { buildCancelScope } from "./buildCancelScope";
import type { CancelIntent } from "./cancelTypes";

const order = {
  id: "order-1",
  type: "onboarding",
  sub_orders: [
    {
      id: "sub-open",
      employee_id: "emp-open",
      employee_first_name: "Open",
      employee_last_name: "User",
      status: "pending",
      amount: "500",
      cancellation_status: { can_cancel: true, instant: true },
      assets: [{ id: "asset-open", name: "MacBook", price: "500" }],
    },
    {
      id: "sub-cancelled",
      employee_id: "emp-cancelled",
      employee_first_name: "Cancelled",
      employee_last_name: "User",
      status: "order_cancelled",
      amount: "400",
      cancellation_status: { can_cancel: false, instant: true },
      assets: [{ id: "asset-cancelled", name: "iPhone", price: "400" }],
    },
    {
      id: "sub-delivered",
      employee_id: "emp-delivered",
      employee_first_name: "Delivered",
      employee_last_name: "User",
      status: "completed",
      amount: "300",
      cancellation_status: { can_cancel: false, instant: true },
      assets: [{ id: "asset-delivered", name: "Monitor", price: "300" }],
    },
  ],
} as unknown as IOrder;

test("buildCancelScope labels cancelled sub-orders as Cancelled not Delivered", () => {
  const employees = buildCancelEmployees(order);
  const intent: CancelIntent = { type: "order" };
  const scope = buildCancelScope({
    employees,
    intent,
    scope: { kind: "order" },
    selectedIds: new Set(),
    isOffboarding: false,
  });

  const cancelled = scope.people
    .flatMap((person) => person.devices)
    .find((device) => device.id === "asset-cancelled");
  const delivered = scope.people
    .flatMap((person) => person.devices)
    .find((device) => device.id === "asset-delivered");

  assert.equal(cancelled?.exclusionReason, "cancelled");
  assert.equal(cancelled?.note, "Cancelled");
  assert.equal(delivered?.exclusionReason, "delivered");
  assert.equal(delivered?.note, "Already delivered");
});
