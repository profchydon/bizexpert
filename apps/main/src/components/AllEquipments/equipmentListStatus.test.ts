import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARCHIVED_EQUIPMENT_LIST_STATUS,
  resolveEquipmentListStatus,
  toApiEquipmentStatus,
} from "./equipmentListStatus";

describe("resolveEquipmentListStatus", () => {
  it("uses lowercase archived for the archive tab API query", () => {
    assert.equal(ARCHIVED_EQUIPMENT_LIST_STATUS, "archived");
    assert.equal(resolveEquipmentListStatus(true), "archived");
  });

  it("passes through filter status on the equipment tab", () => {
    assert.equal(resolveEquipmentListStatus(false, "assigned"), "assigned");
  });

  it("prefers archived status over applied filters on the archive tab", () => {
    assert.equal(resolveEquipmentListStatus(true, "assigned"), "archived");
  });

  it("keeps the unassigned filter lowercase for the API", () => {
    assert.equal(resolveEquipmentListStatus(false, "unassigned"), "unassigned");
  });

  it("lowercases Unassigned inside a multi-status filter and keeps the rest", () => {
    assert.equal(
      resolveEquipmentListStatus(false, "assigned,Unassigned,in_storage"),
      "assigned,unassigned,in_storage",
    );
  });

  it("returns undefined when no filter status is applied", () => {
    assert.equal(resolveEquipmentListStatus(false, null), undefined);
    assert.equal(resolveEquipmentListStatus(false, ""), undefined);
  });
});

describe("toApiEquipmentStatus", () => {
  it("lowercases Unassigned for the API", () => {
    assert.equal(toApiEquipmentStatus("Unassigned"), "unassigned");
    assert.equal(toApiEquipmentStatus("unassigned"), "unassigned");
  });

  it("leaves other statuses untouched", () => {
    assert.equal(toApiEquipmentStatus("assigned"), "assigned");
    assert.equal(toApiEquipmentStatus("in_storage"), "in_storage");
    assert.equal(toApiEquipmentStatus("sold"), "sold");
  });
});
