import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { toggleRowSelection } from "./toggleRowSelection";

const dir = dirname(fileURLToPath(import.meta.url));
const tables = ["OfficeAssetsTable.tsx", "OfficeEmployeesTable.tsx"].map(
  (file) => readFileSync(join(dir, "../components", file), "utf8"),
);

describe("toggleRowSelection", () => {
  it("adds an unselected id", () => {
    const next = toggleRowSelection(new Set(["a"]), "b");
    assert.deepEqual([...next].sort(), ["a", "b"]);
  });

  it("removes an already selected id", () => {
    const next = toggleRowSelection(new Set(["a", "b"]), "b");
    assert.deepEqual([...next], ["a"]);
  });

  it("does not mutate the original set", () => {
    const original = new Set(["a"]);
    toggleRowSelection(original, "b");
    assert.deepEqual([...original], ["a"]);
  });
});

describe("office member tables row selection", () => {
  it("toggles selection when the row itself is clicked", () => {
    for (const source of tables) {
      assert.match(source, /<TableRow\s*\n\s*key=/);
      assert.match(source, /onClick=\{\(\) =>\s*\n?\s*active &&/);
      assert.match(source, /toggleRowSelection\(selected, /);
    }
  });

  it("stops checkbox clicks from bubbling into the row toggle", () => {
    for (const source of tables) {
      assert.match(
        source,
        /onClick=\{\(event\) => event\.stopPropagation\(\)\}/,
      );
    }
  });
});
