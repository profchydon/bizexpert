import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const addItemsPaths = [
  "src/components/Drawers/AddItems/index.tsx",
  "src/components/DeviceRefresh/AddItems/index.tsx",
  "src/container/Dashboard/Storage/AssignEmployees/AddItems/index.tsx",
];

const removeItemsPaths = [
  "src/components/Drawers/RemoveItems/index.tsx",
  "src/container/Dashboard/Storage/AssignEmployees/RemoveItems/index.tsx",
];

describe("AddItems drawer footer", () => {
  for (const relativePath of addItemsPaths) {
    it(`uses DrawerRight footer in ${relativePath}`, () => {
      const source = readFileSync(join(process.cwd(), relativePath), "utf8");

      assert.match(source, /saveText="Add"/);
      assert.doesNotMatch(source, /hideDefaultFooterBtn/);
      assert.doesNotMatch(source, /fixed bottom-0 left-0 right-0 border-t/);
    });
  }
});

describe("RemoveItems drawer footer", () => {
  for (const relativePath of removeItemsPaths) {
    it(`uses DrawerRight footer in ${relativePath}`, () => {
      const source = readFileSync(join(process.cwd(), relativePath), "utf8");

      assert.match(source, /saveText="Remove"/);
      assert.doesNotMatch(source, /hideDefaultFooterBtn/);
      assert.doesNotMatch(source, /fixed bottom-0 left-0 right-0 border-t/);
    });
  }
});

describe("DrawerRight footer divider", () => {
  it("uses in-flow footer border spanning drawer width", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/DrawerRight/index.tsx"),
      "utf8",
    );

    assert.match(source, /shrink-0 border-t border-gray-200/);
    assert.match(source, /flex h-full min-h-0 flex-col/);
    assert.match(source, /customFooter\?: React\.ReactNode/);
    assert.doesNotMatch(source, /fixed inset-x-0 bottom-0 border-t/);
    assert.doesNotMatch(source, /pb-\[70px\]/);
  });
});
