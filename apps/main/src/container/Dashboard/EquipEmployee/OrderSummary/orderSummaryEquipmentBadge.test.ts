import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  equipmentBadgeLabel,
  equipmentBadgeVariant,
} from "./orderSummaryEquipmentBadge";

describe("orderSummaryEquipmentBadge", () => {
  it("maps dispose, check, and deploy actions to badge styles", () => {
    assert.equal(equipmentBadgeVariant("Dispose"), "pending");
    assert.equal(equipmentBadgeVariant("device_check"), "gray");
    assert.equal(equipmentBadgeVariant("Deploy from storage"), "blue");
    assert.equal(equipmentBadgeVariant(undefined, true), "gray");
  });

  it("labels known actions and falls back for storage", () => {
    assert.equal(equipmentBadgeLabel("archive"), "Dispose");
    assert.equal(equipmentBadgeLabel("Device check"), "Device check");
    assert.equal(equipmentBadgeLabel("deployment"), "Deploy");
    assert.equal(equipmentBadgeLabel(undefined, true), "In storage");
  });
});
