import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONTAINED_SLIDEOUT_CONTENT_CLASS,
  CONTAINED_SLIDEOUT_OVERLAY_CLASS,
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
  SLIDEOUT_DIALOG_TEST_ID,
  SLIDEOUT_MENU_OVERLAY_CLASS,
  getSlideoutDialogElement,
  shouldElevateModalOverDrawer,
} from "./drawerOverlayStacking";

const disconnectModal = readFileSync(
  join(process.cwd(), "src/components/DisconnectIntegrationModal.tsx"),
  "utf8",
);

describe("drawerOverlayStacking", () => {
  it("elevates modals opened from the employees drawer", () => {
    assert.equal(shouldElevateModalOverDrawer("employees"), true);
    assert.equal(shouldElevateModalOverDrawer(undefined), false);
    assert.equal(shouldElevateModalOverDrawer("settings"), false);
  });

  it("uses z-index above DrawerRight default (1007)", () => {
    assert.equal(ELEVATED_MODAL_OVERLAY_CLASS, "z-[1010]");
    assert.equal(ELEVATED_MODAL_CONTENT_CLASS, "z-[1011]");
    assert.equal(CONTAINED_SLIDEOUT_OVERLAY_CLASS, "absolute inset-0 z-[1009]");
    assert.equal(CONTAINED_SLIDEOUT_CONTENT_CLASS, "absolute z-[1010]");
    assert.match(SLIDEOUT_MENU_OVERLAY_CLASS, /z-\[1007\]/);
  });

  it("portals elevated dialogs into the slideout so they stay clickable", () => {
    assert.equal(SLIDEOUT_DIALOG_TEST_ID, "slideout-menu-dialog");
    assert.equal(getSlideoutDialogElement(), undefined);
    assert.match(disconnectModal, /getSlideoutDialogElement/);
    assert.match(disconnectModal, /container=\{portalContainer\}/);
    assert.match(disconnectModal, /CONTAINED_SLIDEOUT_OVERLAY_CLASS/);
  });
});
