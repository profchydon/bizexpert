import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Settings/Users/AddEmployee/AddNewEmployee/index.tsx",
  ),
  "utf8",
);

describe("add new employee save", () => {
  it("still sends the request and keeps the success flow", () => {
    assert.match(source, /as unknown as AddEmployeeRequest/);
    assert.match(source, /await addEmployeeAsAdmin\(payload\)\.unwrap\(\)/);
    assert.match(source, /displaySuccessMessage\(/);
    assert.match(source, /onClose\(\)/);
  });

  it("surfaces add-admin failures instead of swallowing them", () => {
    assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
    assert.match(source, /showApiError\(error\)/);
    assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
  });
});
