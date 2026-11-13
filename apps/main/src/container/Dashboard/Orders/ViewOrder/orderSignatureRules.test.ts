import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IOrder, ISubOrder } from "@/types/orders";
import {
  buildConfirmDialogData,
  getEmployeeNameFromSubOrder,
  isSubOrderUpdatable,
} from "./orderSignatureRules";

const sub = (overrides: Partial<ISubOrder>): ISubOrder =>
  ({ id: "s", status: "in_progress", ...overrides }) as ISubOrder;

describe("isSubOrderUpdatable", () => {
  it("is false for shipped/finalized statuses", () => {
    assert.equal(isSubOrderUpdatable(sub({ status: "completed" })), false);
    assert.equal(
      isSubOrderUpdatable(sub({ status: "delivered" as any })),
      false,
    );
  });

  it("is true for active statuses", () => {
    assert.equal(isSubOrderUpdatable(sub({ status: "in_progress" })), true);
    assert.equal(isSubOrderUpdatable(sub({ status: "pending" })), true);
  });
});

describe("getEmployeeNameFromSubOrder", () => {
  it("uses onboarding first/last name when present", () => {
    const name = getEmployeeNameFromSubOrder(
      sub({ employee_first_name: "Ada", employee_last_name: "Lovelace" }),
    );
    assert.equal(name, "Ada Lovelace");
  });

  it("uses reassign target name for offboarding reassign", () => {
    const order = { type: "offboarding" } as IOrder;
    const name = getEmployeeNameFromSubOrder(
      {
        type: "reassign",
        order_details: { to: { first_name: "Grace", last_name: "Hopper" } },
      },
      order,
    );
    assert.equal(name, "Grace Hopper");
  });

  it("labels resale sub-orders as Resale", () => {
    const order = { type: "offboarding" } as IOrder;
    assert.equal(
      getEmployeeNameFromSubOrder({ type: "resale" }, order),
      "Resale",
    );
  });

  it("falls back to N/A", () => {
    assert.equal(getEmployeeNameFromSubOrder({}), "N/A");
  });
});

describe("buildConfirmDialogData", () => {
  it("splits updatable and non-updatable rows with counts", () => {
    const rows = [
      sub({ id: "a", status: "in_progress", employee_first_name: "A" }),
      sub({ id: "b", status: "completed", employee_first_name: "B" }),
    ];
    const result = buildConfirmDialogData(rows);
    assert.equal(result.totalCount, 2);
    assert.equal(result.updatedCount, 1);
    assert.equal(result.successSubOrders.length, 1);
    assert.equal(result.failedSubOrders.length, 1);
    assert.equal(
      result.failedSubOrders[0].reason,
      "Already shipped or completed",
    );
  });
});
