import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("Add setup confirm loading", () => {
  it("wires isSaveLoading through AddSetup into DrawerRight", () => {
    const addSetup = readFileSync(
      join(process.cwd(), "src/components/DeviceRefresh/AddSetup/index.tsx"),
      "utf8",
    );
    const drawerRight = readFileSync(
      join(process.cwd(), "src/components/DrawerRight/index.tsx"),
      "utf8",
    );

    assert.match(addSetup, /isSaveLoading\?: boolean/);
    assert.match(addSetup, /isSaveLoading=\{isSaveLoading\}/);
    assert.match(drawerRight, /isSaveLoading\?: boolean/);
    assert.match(drawerRight, /isLoading=\{isSaveLoading\}/);
    assert.match(drawerRight, /disabled=\{isSaveLoading\}/);
  });

  it("uses transition router loading in cart overview confirm setup", () => {
    const cartOverview = readFileSync(
      join(process.cwd(), "src/components/Drawers/CartOverview/index.tsx"),
      "utf8",
    );

    assert.match(cartOverview, /useTransitionRouter/);
    assert.match(cartOverview, /isConfirmSetupNavigating/);
    assert.match(cartOverview, /isSaveLoading=\{isConfirmSetupNavigating\}/);
  });
});
