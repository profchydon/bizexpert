import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveSelectEquipmentNextStep } from "./offboardSteps";

describe("resolveSelectEquipmentNextStep", () => {
  it("routes Transfer to the receiver drawer", () => {
    assert.equal(resolveSelectEquipmentNextStep("Transfer"), "selectReceiver");
  });

  it("routes Store straight to the collection-date drawer", () => {
    assert.equal(resolveSelectEquipmentNextStep("Store"), "selectDate");
  });

  it("does not route Store through a storage-duration step", () => {
    assert.notEqual(
      resolveSelectEquipmentNextStep("Store") as string,
      "storageDuration",
    );
  });

  it("returns null for an undefined action type", () => {
    assert.equal(resolveSelectEquipmentNextStep(undefined), null);
  });

  it("returns null for unrelated action types", () => {
    assert.equal(resolveSelectEquipmentNextStep("Sale"), null);
    assert.equal(resolveSelectEquipmentNextStep("Archive"), null);
  });
});
