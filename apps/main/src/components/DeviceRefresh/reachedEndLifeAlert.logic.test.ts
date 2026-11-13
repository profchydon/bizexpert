import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getRefreshBlockedMessage,
  isAssignedEquipmentStatus,
} from "./reachedEndLifeAlert.logic";

describe("isAssignedEquipmentStatus", () => {
  it("matches assigned regardless of casing", () => {
    assert.equal(isAssignedEquipmentStatus("assigned"), true);
    assert.equal(isAssignedEquipmentStatus("Assigned"), true);
    assert.equal(isAssignedEquipmentStatus("ASSIGNED"), true);
  });

  it("rejects other statuses", () => {
    assert.equal(isAssignedEquipmentStatus("in_storage"), false);
    assert.equal(isAssignedEquipmentStatus(""), false);
  });
});

describe("getRefreshBlockedMessage", () => {
  it("returns empty string for assigned devices", () => {
    assert.equal(getRefreshBlockedMessage("assigned"), "");
  });

  it("describes the blocking status for non-assigned devices", () => {
    assert.match(getRefreshBlockedMessage("in_storage"), /in storage/i);
  });
});
