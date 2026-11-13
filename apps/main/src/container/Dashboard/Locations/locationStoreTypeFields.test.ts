import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Locations/LocationStoreTypeFields.tsx",
  "utf8",
);

test("create-store RadioGroup uses aria-label not a label prop", () => {
  assert.match(source, /<RadioGroup/);
  assert.match(source, /aria-label="Store type"/);
  assert.match(source, /<Label>Store type<\/Label>/);
  assert.doesNotMatch(source, /<RadioGroup\s+label=/);
});
