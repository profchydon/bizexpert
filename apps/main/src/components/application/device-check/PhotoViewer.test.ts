import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { cx } from "@/utils/cx";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";

const source = readFileSync(
  join(
    process.cwd(),
    "src/components/application/device-check/PhotoViewer.tsx",
  ),
  "utf8",
);

describe("PhotoViewer", () => {
  it("stacks above the storage device drawer", () => {
    assert.match(source, /ELEVATED_MODAL_OVERLAY_CLASS/);
    assert.match(source, /ELEVATED_MODAL_CONTENT_CLASS/);
    assert.equal(
      cx("fixed inset-0 z-50", ELEVATED_MODAL_OVERLAY_CLASS),
      `fixed inset-0 ${ELEVATED_MODAL_OVERLAY_CLASS}`,
    );
  });

  it("renders photos through SafeImage instead of a raw img", () => {
    assert.match(source, /SafeImage/);
    assert.doesNotMatch(source, /<img\b/);
  });
});
