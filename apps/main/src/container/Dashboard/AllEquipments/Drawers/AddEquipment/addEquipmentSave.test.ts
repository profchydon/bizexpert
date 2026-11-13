import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const hook = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
  ),
  "utf8",
);
const submit = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/submitSingleEquipmentCreate.ts",
  ),
  "utf8",
);

describe("add equipment save", () => {
  it("does not log the create payload", () => {
    assert.equal(hook.includes("console.log"), false);
    assert.equal(submit.includes("describeCreateEquipmentPayload"), false);
  });

  it("still sends the request and keeps the success flow", () => {
    assert.match(hook, /await createEquipment\(payload\)\.unwrap\(\)/);
    assert.match(hook, /displaySuccessMessage\(/);
    assert.match(hook, /push\("\/dashboard\/all-equipments"\)/);
  });

  it("surfaces create or assign failures instead of swallowing them", () => {
    assert.doesNotMatch(hook, /\.catch\(\(\) => \{\}\)/);
    assert.match(hook, /showApiError\(error\)/);
    assert.doesNotMatch(hook, /displayErrorMessage\(title, description\)/);
  });
});
