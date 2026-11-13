import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildStorageDeviceSpecs } from "./buildStorageDeviceSpecs";

describe("buildStorageDeviceSpecs", () => {
  it("joins processor, memory, storage, and display in order", () => {
    assert.equal(
      buildStorageDeviceSpecs({
        processor: "M3 Chip",
        memory: "16GB",
        storage: "512 GB SSD",
        display: "13.6-inch Liquid Retina Display",
      }),
      "M3 Chip · 16GB · 512 GB SSD · 13.6-inch Liquid Retina Display",
    );
  });

  it("omits missing fields and skips empty values", () => {
    assert.equal(
      buildStorageDeviceSpecs({ memory: "16GB", storage: "512 GB SSD" }),
      "16GB · 512 GB SSD",
    );
    assert.equal(
      buildStorageDeviceSpecs({ memory: "  ", storage: "" }),
      undefined,
    );
  });

  it("returns undefined when specs are missing", () => {
    assert.equal(buildStorageDeviceSpecs(undefined), undefined);
  });
});
