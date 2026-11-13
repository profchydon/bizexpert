import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toStorageCartWriteItems } from "./toStorageCartWriteItems";

describe("toStorageCartWriteItems", () => {
  it("writes check, disposal, and deploy lines with the workspace company id", () => {
    const items = toStorageCartWriteItems(
      [
        {
          kind: "device_check",
          deviceId: "eq-1",
          checkReason: "Pre-deployment check",
          neededBy: "2026-08-19",
        },
        { kind: "disposal", deviceId: "eq-2", disposalMethod: "destroy" },
        { kind: "deployment", deviceId: "eq-3" },
        {
          kind: "deployment",
          deviceId: "eq-4",
          employeeId: "emp-4",
        },
      ],
      "company-workspace",
    );

    assert.deepEqual(items, [
      {
        type: "storage_device_check",
        equipment_id: "eq-1",
        company_id: "company-workspace",
        reason: "Pre-deployment check",
        needed_by: "2026-08-19",
      },
      {
        type: "storage_disposal",
        equipment_id: "eq-2",
        company_id: "company-workspace",
        disposal_method: "destroy",
      },
      {
        type: "storage_deploy_to_employee",
        equipment_id: "eq-4",
        company_id: "company-workspace",
        employee_id: "emp-4",
      },
    ]);
  });

  it("does not invent disposal fields and skips items without a company or device", () => {
    assert.deepEqual(
      toStorageCartWriteItems([{ kind: "disposal", deviceId: "eq-2" }], ""),
      [],
    );
    assert.ok(
      !(
        "reason" in
        toStorageCartWriteItems(
          [{ kind: "disposal", deviceId: "eq-2" }],
          "company-workspace",
        )[0]!
      ),
    );
    assert.ok(
      !(
        "disposal_method" in
        toStorageCartWriteItems(
          [{ kind: "disposal", deviceId: "eq-2" }],
          "company-workspace",
        )[0]!
      ),
    );
  });
});
