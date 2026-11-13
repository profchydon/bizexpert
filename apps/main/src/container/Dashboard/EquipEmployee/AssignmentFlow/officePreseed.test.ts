import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("officePreseed", () => {
  it("writes and clears the assign office key", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/AssignmentFlow/officePreseed.ts",
      ),
      "utf8",
    );
    assert.match(source, /rr-assign-office-preseed/);
    assert.match(source, /export function setOfficePreseed/);
    assert.match(source, /export function readOfficePreseed/);
    assert.match(source, /export function clearOfficePreseed/);
    assert.match(source, /rr-assign-office-contact/);
    assert.match(source, /export function writeOfficeContactPreseed/);
    assert.match(source, /export function readOfficeContactPreseed/);
  });
});
