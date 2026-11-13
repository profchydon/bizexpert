import assert from "node:assert/strict";
import test from "node:test";
import { IOrder } from "@/types/orders";
import { buildCancelEmployees } from "./cancelData";
import { buildCancelScope } from "./buildCancelScope";
import { modalTitle } from "./buildCancelConsequence";
import {
  cancellationScopeForLines,
  cancellableLineIds,
  cancelRequestIds,
  lineSelectionState,
} from "./cancelLineSelection";

const order = {
  id: "order-1",
  type: "onboarding",
  sub_orders: [
    {
      id: "sub-1",
      employee_id: "emp-1",
      employee_first_name: "Obi",
      employee_last_name: "John",
      status: "verification_pending",
      assets: [
        {
          id: "catalog-1",
          asset_order_id: "line-a",
          name: "MacBook",
          asset_pricing: { amount: "1127" },
          cancellation_status: {
            can_cancel: true,
            status: "verification_pending",
          },
        },
        {
          id: "catalog-1",
          asset_order_id: "line-b",
          name: "MacBook",
          status: "order_cancelled",
          asset_pricing: { amount: "1127" },
          cancellation_status: { can_cancel: false, status: "order_cancelled" },
        },
        {
          id: "catalog-1",
          asset_order_id: "line-c",
          name: "MacBook",
          asset_pricing: { amount: "1127" },
          cancellation_status: {
            can_cancel: true,
            status: "verification_pending",
          },
        },
      ],
    },
  ],
} as unknown as IOrder;

test("shared catalog ids stay separate cancel lines", () => {
  const employees = buildCancelEmployees(order);
  const intent = { type: "sub-orders" as const, employeeIds: ["sub-1"] };
  assert.deepEqual(cancellableLineIds(employees, intent), ["line-a", "line-c"]);

  const scope = buildCancelScope({
    employees,
    intent,
    scope: { kind: "sub-orders", employeeIds: ["sub-1"] },
    selectedIds: new Set(["sub-1"]),
    isOffboarding: false,
    selectedLineIds: new Set(["line-a"]),
  });
  const devices = scope.people[0].devices;
  assert.deepEqual(
    devices.map((device) => device.id),
    ["line-a", "line-c", "line-b"],
  );
  assert.equal(
    devices.find((device) => device.id === "line-b")?.excluded,
    true,
  );
  assert.equal(scope.exclusion.devices, 1);
  assert.equal(scope.total, 1127);
});

test("cancel request sends only the checked device lines", () => {
  const employees = buildCancelEmployees(order);
  assert.deepEqual(cancelRequestIds(employees, ["line-c"]), {
    employeeIds: ["sub-1"],
    suborderIds: ["line-c"],
  });
  assert.equal(lineSelectionState(["line-a", "line-c"], ["line-a"]), "some");
  assert.equal(
    cancellationScopeForLines({
      intent: { type: "sub-orders", employeeIds: ["sub-1"] },
      coversEverything: true,
      employeeIds: ["sub-1"],
      selectable: ["line-a", "line-c"],
      selected: ["line-a"],
    }).kind,
    "items",
  );
});

test("modalTitle counts a partial device selection", () => {
  assert.equal(
    modalTitle({
      intent: { type: "sub-orders", employeeIds: ["sub-1"] },
      cancellationScope: { kind: "items", itemIds: ["line-a", "line-c"] },
      scope: {
        people: [],
        total: 0,
        spent: 0,
        exclusion: { devices: 2, excludedDevices: 0, basis: "hardware" },
      },
      orderId: "RE-ONB-FD469-2026",
    }),
    "Cancel 2 devices?",
  );
});
