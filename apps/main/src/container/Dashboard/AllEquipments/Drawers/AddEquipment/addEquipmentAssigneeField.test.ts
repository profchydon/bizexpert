import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const extraFields = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddExtraFields.tsx",
  ),
  "utf8",
);

describe("add equipment assignee field", () => {
  it("shows the assignee picker only for an assigned asset", () => {
    assert.match(extraFields, /const status = form\.watch\("status"\)/);
    assert.match(extraFields, /id: "unassigned"/);
    assert.match(extraFields, /id: "Assigned"/);
    assert.match(extraFields, /status === "Assigned" \? \(/);
    assert.match(extraFields, /label="Select assignee"/);
  });

  it("hides the assignee picker for the unassigned instance", () => {
    assert.match(extraFields, /id: "unassigned", label: "Unassigned"/);
    assert.doesNotMatch(
      extraFields,
      /status === "unassigned" \? \([\s\S]*Select assignee/,
    );
  });

  it("spans the full form width instead of sharing the asset status row", () => {
    assert.match(
      extraFields,
      /status === "Assigned" \? \([\s\S]*?<div className="col-span-2">\s*<Select\.ComboBox/,
    );
  });

  it("keeps the asset status select at half width", () => {
    assert.doesNotMatch(
      extraFields,
      /<div className="col-span-2">\s*<Select\s[\s\S]*?label="Asset status"/,
    );
  });

  it("sends the employee id on create and skips the assignee PUT", async () => {
    const { buildCreateEquipmentFormData } =
      await import("./submitSingleEquipmentCreate.ts");
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
      ),
      "utf8",
    );

    const formData = buildCreateEquipmentFormData(
      {
        title: "MacBook",
        type: "Laptop/Workstation",
        state: "Brand_New",
        status: "Assigned",
        assignee: "019ff170-1d40-7270-b260-c9faea88a001",
        properties: [],
      },
      undefined,
    );

    assert.equal(
      formData.get("assignee"),
      "019ff170-1d40-7270-b260-c9faea88a001",
    );
    assert.equal(formData.get("status"), "Assigned");
    assert.doesNotMatch(hook, /unAndReAssignEquipmentAssignee/);
    assert.doesNotMatch(hook, /assignedEquipmentPayload/);
  });
});
