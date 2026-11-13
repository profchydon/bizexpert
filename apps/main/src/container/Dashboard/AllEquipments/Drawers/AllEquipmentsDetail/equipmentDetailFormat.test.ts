import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IAssetCategory } from "@/types/assets";
import {
  formatSpecification,
  isUuid,
  resolveEquipmentType,
} from "./equipmentDetailFormat";

const assetTypes = [
  { id: "9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6", name: "Accessories" },
  { id: "9e3024c8-337e-445c-b0bd-728ddbc75c09", name: "Laptop/Workstation" },
] as IAssetCategory[];

describe("isUuid", () => {
  it("detects a UUID string", () => {
    assert.equal(isUuid("9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6"), true);
  });

  it("rejects readable names and empty values", () => {
    assert.equal(isUuid("Accessories"), false);
    assert.equal(isUuid(""), false);
    assert.equal(isUuid(null), false);
  });
});

describe("resolveEquipmentType", () => {
  it("maps a type id to its asset-type name", () => {
    assert.equal(
      resolveEquipmentType("9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6", assetTypes),
      "Accessories",
    );
  });

  it("returns a readable name as-is", () => {
    assert.equal(
      resolveEquipmentType("Accessories", assetTypes),
      "Accessories",
    );
  });

  it("returns null for an unresolved UUID instead of the raw value", () => {
    assert.equal(
      resolveEquipmentType("11111111-2222-3333-4444-555555555555", assetTypes),
      null,
    );
  });

  it("returns null for empty input", () => {
    assert.equal(resolveEquipmentType(undefined, assetTypes), null);
    assert.equal(resolveEquipmentType("", assetTypes), null);
  });
});

describe("formatSpecification", () => {
  it("strips HTML markup from the description", () => {
    assert.equal(
      formatSpecification({ description: "<p>Black, Analog</p>" }),
      "Black, Analog",
    );
  });

  it("drops an empty stringified array from other details", () => {
    assert.equal(
      formatSpecification({
        description: "<p>Black, Analog</p>",
        otherDetails: "[]",
      }),
      "Black, Analog",
    );
  });

  it("appends parsed detail tags", () => {
    assert.equal(
      formatSpecification({
        description: "<p>Black</p>",
        otherDetails: '["Wireless", "Mechanical"]',
      }),
      "Black, Wireless, Mechanical",
    );
  });

  it("handles array other details", () => {
    assert.equal(
      formatSpecification({ description: "", otherDetails: ["Matte", "Slim"] }),
      "Matte, Slim",
    );
  });

  it("returns an empty string when nothing is available", () => {
    assert.equal(
      formatSpecification({ description: "", otherDetails: "[]" }),
      "",
    );
    assert.equal(formatSpecification({}), "");
  });
});
