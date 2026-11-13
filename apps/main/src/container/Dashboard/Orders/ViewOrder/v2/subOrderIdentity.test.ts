import assert from "node:assert/strict";
import test from "node:test";
import { ISubOrder } from "@/types/orders";
import { buildCancelEmployees } from "./cancel/cancelData";
import {
  subOrderCancelItems,
  subOrderEmployeeId,
  subOrderEmployeeName,
} from "./subOrderIdentity";
import { subOrderCustomerAmount } from "./subOrderCustomerPricing";

const equipment = {
  id: "eq-1",
  title: "MacBook Pro",
  make: "Apple",
  assignee: { id: "user-1", name: "Aela Aela" },
};

test("subOrderEmployeeName resolves offboarding assignee from equipment", () => {
  const subOrder = {
    id: "sub-1",
    employee_id: "",
    employee_first_name: "",
    employee_last_name: "",
    user_id: "user-1",
    equipment,
    status: "pending",
  } as unknown as ISubOrder;

  assert.equal(subOrderEmployeeName(subOrder), "Aela Aela");
  assert.equal(subOrderEmployeeId(subOrder), "user-1");
});

test("subOrderCancelItems maps offboarding equipment lines", () => {
  const subOrder = {
    id: "sub-1",
    user_id: "user-1",
    equipment,
    total_amount: 154.15,
    status: "pending",
    assets: [],
  } as unknown as ISubOrder;

  const items = subOrderCancelItems(subOrder, true, false);
  assert.equal(items.length, 1);
  assert.match(items[0].name, /MacBook Pro/);
  assert.equal(items[0].price, 154.15);
});

test("buildCancelEmployees groups offboarding devices under one employee", () => {
  const order = {
    id: "order-1",
    type: "offboarding",
    sub_orders: [
      {
        id: "sub-1",
        user_id: "user-1",
        equipment: { ...equipment, id: "eq-1" },
        total_amount: 154.15,
        status: "pending",
        assets: [],
        cancellation_status: { can_cancel: true, instant: true },
      },
      {
        id: "sub-2",
        user_id: "user-1",
        equipment: { ...equipment, id: "eq-2", title: "HP Zbook" },
        total_amount: 154.15,
        status: "pending",
        assets: [],
        cancellation_status: { can_cancel: true, instant: true },
      },
    ],
  } as never;

  const rows = buildCancelEmployees(order);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Aela Aela");
  assert.equal(rows[0].items.length, 2);
  assert.equal(rows[0].amount, 308.3);
  assert.equal(subOrderCustomerAmount(order.sub_orders![0]), 154.15);
});
