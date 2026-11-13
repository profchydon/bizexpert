import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OfficeScopedEquipment } from "../mapOfficeMembers";
import { isOfficeAddableAsset } from "../isOfficeAddableAsset";

const baseRow = {
  assignee: null,
  office_id: "office-b",
} as unknown as OfficeScopedEquipment;

describe("isOfficeAddableAsset", () => {
  it("rejects equipment already on the target office", () => {
    assert.equal(
      isOfficeAddableAsset(
        { ...baseRow, office_id: "office-a" } as OfficeScopedEquipment,
        "office-a",
        "entity-1",
        "primary-1",
      ),
      false,
    );
  });

  it("allows equipment owned by the office entity", () => {
    assert.equal(
      isOfficeAddableAsset(
        { ...baseRow, company_id: "entity-1" } as OfficeScopedEquipment,
        "office-a",
        "entity-1",
        "primary-1",
      ),
      true,
    );
  });

  it("allows primary-account equipment for a subsidiary office", () => {
    assert.equal(
      isOfficeAddableAsset(
        { ...baseRow, company_id: "primary-1" } as OfficeScopedEquipment,
        "office-a",
        "entity-1",
        "primary-1",
      ),
      true,
    );
  });

  it("rejects equipment owned by another subsidiary", () => {
    assert.equal(
      isOfficeAddableAsset(
        { ...baseRow, company_id: "entity-sibling" } as OfficeScopedEquipment,
        "office-a",
        "entity-1",
        "primary-1",
      ),
      false,
    );
  });
});
