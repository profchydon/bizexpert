import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createEmptyDevice,
  getCustomRequestSubmitDisabledReason,
} from "./data";

describe("getCustomRequestSubmitDisabledReason", () => {
  it("returns null when every device is complete", () => {
    assert.equal(
      getCustomRequestSubmitDisabledReason([
        {
          ...createEmptyDevice("1"),
          deviceName: "MacBook Pro",
          assetType: "Laptop",
          quantity: "2",
          description: "Needs 16GB RAM.",
          extendedSpecs: [{ id: "1", key: "ram", value: "16GB" }],
        },
      ]),
      null,
    );
  });

  it("lists missing fields for a single device", () => {
    assert.equal(
      getCustomRequestSubmitDisabledReason([
        {
          ...createEmptyDevice("1"),
          deviceName: "MB Pro",
          assetType: "Laptop",
          quantity: "2",
          description: "For V2",
        },
      ]),
      "Add at least one spec to submit.",
    );
  });

  it("names the device when only one entry is incomplete in a multi-device form", () => {
    assert.equal(
      getCustomRequestSubmitDisabledReason([
        {
          ...createEmptyDevice("1"),
          deviceName: "MB Pro",
          assetType: "Laptop",
          quantity: "2",
          description: "For V2",
          extendedSpecs: [{ id: "1", key: "ram", value: "16GB" }],
        },
        {
          ...createEmptyDevice("2"),
          deviceName: "Monitor",
          assetType: "Monitor",
          quantity: "1",
        },
      ]),
      "Add description and at least one spec for Device 2 to submit.",
    );
  });
});
