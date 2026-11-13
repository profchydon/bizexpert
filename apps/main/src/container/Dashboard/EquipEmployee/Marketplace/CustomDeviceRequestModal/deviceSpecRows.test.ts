import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addNextDeviceSpecRow,
  defaultDeviceSpecRows,
  ensureConditionSpec,
  getNextAddableSpecKey,
} from "./deviceSpecRows";

describe("deviceSpecRows", () => {
  it("defaults new devices to a condition spec row", () => {
    assert.deepEqual(defaultDeviceSpecRows(), [
      { id: "1", key: "condition", value: "" },
    ]);
  });

  it("adds the next unused preset spec type", () => {
    assert.equal(getNextAddableSpecKey(["condition"]), "processor");
    assert.deepEqual(addNextDeviceSpecRow(defaultDeviceSpecRows()), [
      { id: "1", key: "condition", value: "" },
      { id: "2", key: "processor", value: "" },
    ]);
  });

  it("prepends condition when loading specs without it", () => {
    assert.deepEqual(
      ensureConditionSpec([{ id: "1", key: "ram", value: "16GB" }]),
      [
        { id: "0", key: "condition", value: "" },
        { id: "1", key: "ram", value: "16GB" },
      ],
    );
  });
});
