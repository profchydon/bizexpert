import assert from "node:assert/strict";
import test from "node:test";
import { IOrder } from "@/types/orders";
import { buildCancelEmployees, suborderIdsForIntent } from "./cancelData";
import { buildCancelScope } from "./buildCancelScope";
import type { CancelIntent } from "./cancelTypes";
import { cancelGroupKey } from "../subOrderIdentity";

const onboardingOrder = {
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
  ],
} as unknown as IOrder;

test("cancelGroupKey uses sub-order id for onboarding orders", () => {
  const sub = onboardingOrder.sub_orders![0];
  assert.equal(cancelGroupKey(onboardingOrder, sub), "sub-open");
  assert.notEqual(cancelGroupKey(onboardingOrder, sub), sub.employee_id);
});

test("sub-order cancel intent resolves onboarding rows by sub-order id", () => {
  const employees = buildCancelEmployees(onboardingOrder);
  const intent: CancelIntent = {
    type: "sub-orders",
    employeeIds: ["sub-open"],
  };
  const scope = buildCancelScope({
    employees,
    intent,
    scope: { kind: "sub-orders", employeeIds: ["sub-open"] },
    selectedIds: new Set(["sub-open"]),
    isOffboarding: false,
  });

  assert.equal(scope.people.length, 1);
  assert.equal(scope.people[0].name, "Open User");
  assert.deepEqual(suborderIdsForIntent(onboardingOrder, intent), ["sub-open"]);
});
