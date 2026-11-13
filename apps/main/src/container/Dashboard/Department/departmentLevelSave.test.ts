import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const files = [
  {
    path: "src/container/Dashboard/Department/CreateDepartment.tsx",
    unwrap: /await createDepartment\(payload\)\.unwrap\(\)/,
  },
  {
    path: "src/container/Dashboard/Department/EditDepartment.tsx",
    unwrap: /await editDepartment\(\{[\s\S]*?\}\)\.unwrap\(\)/,
  },
  {
    path: "src/container/Dashboard/Department/Levels/CreateLevel.tsx",
    unwrap: /await createLevel\(\{[\s\S]*?\}\)\.unwrap\(\)/,
  },
  {
    path: "src/container/Dashboard/Department/Levels/EditLevels.tsx",
    unwrap: /await editLevel\(\{[\s\S]*?\}\)\.unwrap\(\)/,
  },
];

describe("department and level save errors", () => {
  for (const file of files) {
    it(`surfaces ${file.path} failures instead of swallowing them`, () => {
      const source = read(file.path);
      assert.match(source, file.unwrap);
      assert.match(source, /displaySuccessMessage\(/);
      assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
      assert.match(source, /showApiError\(error\)/);
      assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
    });
  }
});
