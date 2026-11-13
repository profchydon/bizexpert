import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { cx } from "@/utils/cx";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";

const read = (file: string) =>
  readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/Orders/ViewOrder/v2/cancel",
      file,
    ),
    "utf8",
  );

describe("cancel modal stacking", () => {
  it("CancelOrderModal stacks above slideouts", () => {
    const modal = read("CancelOrderModal.tsx");

    assert.match(modal, /ELEVATED_MODAL_OVERLAY_CLASS/);
    assert.match(modal, /className=\{ELEVATED_MODAL_OVERLAY_CLASS\}/);
    assert.doesNotMatch(modal, /z-\[80\]/);
    assert.equal(
      cx("fixed inset-0 z-50", ELEVATED_MODAL_OVERLAY_CLASS),
      `fixed inset-0 ${ELEVATED_MODAL_OVERLAY_CLASS}`,
    );
  });

  it("WithdrawRequestModal stacks above slideouts", () => {
    const modal = read("WithdrawRequestModal.tsx");

    assert.match(modal, /ELEVATED_MODAL_OVERLAY_CLASS/);
    assert.match(modal, /className=\{ELEVATED_MODAL_OVERLAY_CLASS\}/);
  });

  it("SubOrderCancelModal stacks above order item slideouts", () => {
    const modal = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/SubOrderCancelModal.tsx",
      ),
      "utf8",
    );

    assert.match(modal, /ELEVATED_MODAL_OVERLAY_CLASS/);
    assert.match(modal, /ELEVATED_MODAL_CONTENT_CLASS/);
  });

  it("keeps the modal open through CancelDoneStep after a successful cancel", () => {
    const hook = read("useOrderCancellation.ts");
    const modal = read("CancelOrderModal.tsx");

    assert.doesNotMatch(
      hook,
      /displayCancellationSuccess/,
      "success toast must not replace the done step",
    );
    assert.doesNotMatch(
      hook,
      /closeCancelModal\(\);\s*\n\s*onSuccess/,
      "modal must stay mounted until the user dismisses the done step",
    );
    const modalHook = read("useCancelOrderModal.ts");

    assert.match(modalHook, /setStep\("done"\)/);
    assert.match(modalHook, /doneInstant/);
    assert.match(modalHook, /step === "done"/);
    assert.match(modal, /CancelDoneStep/);
  });
});
