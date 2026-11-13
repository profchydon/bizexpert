import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("DisposeConfirmStep", () => {
  it("binds Confirm disposal to the cart queue pending flag", () => {
    const step = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/dispose/DisposeConfirmStep.tsx",
      "utf8",
    );
    const modal = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/dispose/DisposeDeviceModal.tsx",
      "utf8",
    );
    const dialogs = readFileSync(
      "src/container/Dashboard/Storage/Remote/StoragePageActionDialogs.tsx",
      "utf8",
    );

    assert.match(step, /isLoading=\{isLoading\}/);
    assert.match(step, /Confirm disposal/);
    assert.match(modal, /isLoading=\{isLoading\}/);
    assert.match(dialogs, /isLoading=\{isCartPending\}/);
  });
});
