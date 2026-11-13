import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatEquipmentDisplayName } from "./formatEquipmentDisplayName";

describe("formatEquipmentDisplayName", () => {
  it("replaces hyphens with spaces", () => {
    assert.equal(
      formatEquipmentDisplayName("HP-PROBK-3J9P7M"),
      "HP PROBK 3J9P7M",
    );
    assert.equal(
      formatEquipmentDisplayName("MB-AIR-M4-7P2L8Q"),
      "MB AIR M4 7P2L8Q",
    );
  });

  it("returns an empty string for missing titles", () => {
    assert.equal(formatEquipmentDisplayName(undefined), "");
    assert.equal(formatEquipmentDisplayName(null), "");
  });
});
