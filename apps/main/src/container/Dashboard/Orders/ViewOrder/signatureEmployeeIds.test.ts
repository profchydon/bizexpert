import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ISubOrder } from "@/types/orders";
import { collectSignatureEmployeeIds } from "./signatureEmployeeIds";

const row = (overrides: Partial<ISubOrder>): ISubOrder =>
  ({ id: "s", employee_id: "", ...overrides }) as ISubOrder;

describe("collectSignatureEmployeeIds", () => {
  it("collects non-reassign employee ids from employee_id", () => {
    const rows = [
      row({ type: undefined, employee_id: "emp-1" }),
      row({ type: "buy_to_storage", employee_id: "emp-2" }),
    ];
    const { nonReassignEmployeeIds, reassignEmployeeIds } =
      collectSignatureEmployeeIds(rows);
    assert.deepEqual(nonReassignEmployeeIds, ["emp-1", "emp-2"]);
    assert.deepEqual(reassignEmployeeIds, []);
  });

  it("collects reassign employee ids from order_details.to.id", () => {
    const rows = [
      row({ type: "reassign", order_details: { to: { id: "to-1" } } as any }),
    ];
    const { nonReassignEmployeeIds, reassignEmployeeIds } =
      collectSignatureEmployeeIds(rows);
    assert.deepEqual(nonReassignEmployeeIds, []);
    assert.deepEqual(reassignEmployeeIds, ["to-1"]);
  });

  it("uses the storage assignee id only when storageFallback is enabled", () => {
    const rows = [
      row({
        type: "storage",
        employee_id: "",
        equipment: { assignee: { id: "assignee-1" } } as any,
      }),
    ];

    assert.deepEqual(
      collectSignatureEmployeeIds(rows, { storageFallback: true })
        .nonReassignEmployeeIds,
      ["assignee-1"],
    );
    assert.deepEqual(
      collectSignatureEmployeeIds(rows).nonReassignEmployeeIds,
      [],
    );
  });
});
