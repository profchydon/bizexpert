import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseStorageFees,
  storageFeeForAssetType,
} from "./storageFeeByAssetType";

const byType = {
  Accessories: 15,
  Computer: 25,
  "Laptop/Workstation": 25,
  Macbook: 25,
  Phones: 15,
  Tablet: 15,
};

describe("parseStorageFees", () => {
  it("keeps a numeric storage fee as the default", () => {
    assert.deepEqual(parseStorageFees(35), {
      defaultStorage: 35,
      storageByType: {},
    });
  });

  it("maps storage fees keyed by asset type", () => {
    assert.deepEqual(parseStorageFees(byType), {
      defaultStorage: 0,
      storageByType: byType,
    });
  });

  it("treats a missing value as a zero default", () => {
    assert.deepEqual(parseStorageFees(undefined), {
      defaultStorage: 0,
      storageByType: {},
    });
  });
});

describe("storageFeeForAssetType", () => {
  it("uses the default when no type map is present", () => {
    assert.equal(storageFeeForAssetType({}, 35, "Phones"), 35);
  });

  it("reads the fee for the exact asset type key", () => {
    assert.equal(storageFeeForAssetType(byType, 0, "Phones"), 15);
    assert.equal(storageFeeForAssetType(byType, 0, "Laptop/Workstation"), 25);
  });

  it("matches aliases and spacing differences", () => {
    assert.equal(storageFeeForAssetType(byType, 0, "phone"), 15);
    assert.equal(storageFeeForAssetType(byType, 0, "Laptop"), 25);
    assert.equal(storageFeeForAssetType(byType, 0, "laptop workstation"), 25);
  });

  it("falls back to the default when the type is unknown", () => {
    assert.equal(storageFeeForAssetType(byType, 10, "Monitor"), 10);
    assert.equal(storageFeeForAssetType(byType, 10, ""), 10);
  });
});
