import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const hook = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/Drawers/useSingleEquipmentEditForm.ts",
  ),
  "utf8",
);

describe("edit equipment save", () => {
  it("still sends the request and keeps the success flow", () => {
    assert.match(hook, /await editEquipment\(payload\)\.unwrap\(\)/);
    assert.match(hook, /displaySuccessMessage\(/);
    assert.match(hook, /onClose\(\)/);
  });

  it("surfaces update failures instead of swallowing them", () => {
    assert.doesNotMatch(hook, /\.catch\(\(\) => \{\}\)/);
    assert.match(hook, /showApiError\(error\)/);
    assert.doesNotMatch(hook, /displayErrorMessage\(title, description\)/);
  });
});
