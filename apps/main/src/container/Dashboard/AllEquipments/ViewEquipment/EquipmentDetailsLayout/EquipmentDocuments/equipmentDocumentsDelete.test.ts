import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDocuments/index.tsx",
  ),
  "utf8",
);

describe("equipment documents delete", () => {
  it("still deletes and keeps the success toast", () => {
    assert.match(
      source,
      /await deleteEquipmentDocument\(payload\)\.unwrap\(\)/,
    );
    assert.match(source, /displaySuccessMessage\(/);
  });

  it("surfaces delete failures instead of swallowing them", () => {
    assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
    assert.match(source, /showApiError\(error\)/);
    assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
  });
});
