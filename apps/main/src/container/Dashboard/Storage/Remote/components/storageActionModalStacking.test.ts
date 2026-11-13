import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { cx } from "@/utils/cx";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
  SLIDEOUT_MENU_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";

const read = (file: string) =>
  readFileSync(
    join(process.cwd(), "src/container/Dashboard/Storage/Remote", file),
    "utf8",
  );

const MODALS = [
  "components/dispose/DisposeDeviceModal.tsx",
  "components/deploy/DeployToEmployeeModal.tsx",
  "components/check/RequestCheckModal.tsx",
  "components/BulkActionsModal.tsx",
];

describe("storage action modal stacking", () => {
  it("lifts action dialogs above the device drawer", () => {
    assert.equal(SLIDEOUT_MENU_OVERLAY_CLASS, "z-[1007]");
    assert.equal(
      cx("fixed inset-0 z-50", ELEVATED_MODAL_OVERLAY_CLASS),
      `fixed inset-0 ${ELEVATED_MODAL_OVERLAY_CLASS}`,
    );

    for (const file of MODALS) {
      const source = read(file);
      assert.match(source, /ELEVATED_MODAL_OVERLAY_CLASS/);
      assert.match(source, /className=\{ELEVATED_MODAL_OVERLAY_CLASS\}/);
      assert.match(source, /ELEVATED_MODAL_CONTENT_CLASS/);
    }
  });
});
