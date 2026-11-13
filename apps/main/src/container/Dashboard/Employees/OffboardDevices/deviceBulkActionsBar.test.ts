import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { resolveUniformValue } from "./offboardPricing";

describe("resolveUniformValue", () => {
  it("returns the shared value when every item matches", () => {
    assert.equal(resolveUniformValue(["DISPOSE", "DISPOSE"]), "DISPOSE");
  });

  it("returns null when selected values differ", () => {
    assert.equal(resolveUniformValue(["STORE", "DISPOSE"]), null);
  });
});

describe("DeviceBulkActionsBar", () => {
  it("reflects the uniform selected disposition in the bulk dropdown", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/OffboardDevices/DeviceBulkActionsBar.tsx",
      ),
      "utf8",
    );

    assert.match(source, /resolveUniformValue\(selectedDispositions\)/);
    assert.match(source, /uniformDisposition \?\? bulkDisposition/);
    assert.match(source, /value=\{dispositionValue\}/);
  });
});
