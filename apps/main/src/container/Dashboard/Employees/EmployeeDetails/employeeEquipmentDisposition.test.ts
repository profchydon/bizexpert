import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEquipmentSelectionDisabledReason,
  isDispositionEquipment,
  resolveDispositionDeviceIds,
} from "./employeeEquipmentDisposition";

describe("employeeEquipmentDisposition", () => {
  it("treats assigned equipment as disposition eligible", () => {
    assert.equal(
      isDispositionEquipment({ id: "1", status: "assigned", title: "Laptop" }),
      true,
    );
    assert.equal(
      isDispositionEquipment({
        id: "2",
        status: "request_storage",
        title: "Laptop",
      }),
      false,
    );
  });

  it("resolves device ids against assigned employee equipment", () => {
    const employee = {
      equipment: [
        { id: "1", status: "assigned", title: "A" },
        { id: "2", status: "request_storage", title: "B" },
        { id: "3", status: "Assigned", title: "C" },
      ],
    };

    assert.deepEqual(
      resolveDispositionDeviceIds(employee as any, ["1", "2", "3", "1"]),
      ["1", "3"],
    );
  });

  it("returns a disabled-reason message for ineligible equipment", () => {
    assert.match(
      getEquipmentSelectionDisabledReason({
        id: "1",
        status: "request_storage",
        title: "Laptop",
      }) ?? "",
      /request storage/i,
    );
    assert.equal(
      getEquipmentSelectionDisabledReason({ title: "Laptop" } as any),
      "This equipment record is missing an identifier and cannot be selected.",
    );
    assert.equal(
      getEquipmentSelectionDisabledReason({
        id: "1",
        status: "assigned",
        title: "Laptop",
      }),
      undefined,
    );
  });
});
