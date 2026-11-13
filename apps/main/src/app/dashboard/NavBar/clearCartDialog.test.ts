import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { cx } from "../../../utils/cx";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "../../../utils/drawerOverlayStacking";

const read = (file: string) =>
  readFileSync(join(process.cwd(), "src/app/dashboard/NavBar", file), "utf8");

describe("ClearCartDialog", () => {
  it("stacks above the cart slideout with the destructive confirm action", () => {
    const dialog = read("ClearCartDialog.tsx");

    assert.match(dialog, /from "@\/components\/application\/modals\/modal"/);
    assert.match(dialog, /ELEVATED_MODAL_OVERLAY_CLASS/);
    assert.match(dialog, /className=\{ELEVATED_MODAL_OVERLAY_CLASS\}/);
    assert.match(dialog, /color="primary-destructive"/);
    assert.match(dialog, /Clear cart\?/);
    assert.doesNotMatch(dialog, /AlertDialog/);
    assert.equal(
      cx("fixed inset-0 z-50", ELEVATED_MODAL_OVERLAY_CLASS),
      `fixed inset-0 ${ELEVATED_MODAL_OVERLAY_CLASS}`,
    );
  });

  it("is opened from both cart slideouts", () => {
    assert.match(read("MarketplaceCartSlideout.tsx"), /<ClearCartDialog/);
    assert.match(read("StorageActionsCartOverview.tsx"), /<ClearCartDialog/);
  });
});
