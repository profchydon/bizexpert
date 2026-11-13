import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const source = readFileSync(
  join(process.cwd(), "src/container/Dashboard/AllEquipments/AllEquipment.tsx"),
  "utf8",
);

describe("AllEquipment export data button", () => {
  it("keeps Export data on the Device Fleet header", () => {
    assert.match(source, /Export data/);
    assert.match(source, /iconLeading=\{Download01\}/);
  });

  it("still renders Add equipment next to export", () => {
    assert.match(source, /Add equipment/);
  });
});
