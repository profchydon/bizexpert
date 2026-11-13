import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("RequestCheckFooter", () => {
  it("binds Request check to the cart queue pending flag", () => {
    const footer = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/check/RequestCheckFooter.tsx",
      "utf8",
    );
    const modal = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/check/RequestCheckModal.tsx",
      "utf8",
    );
    const dialogs = readFileSync(
      "src/container/Dashboard/Storage/Remote/StoragePageActionDialogs.tsx",
      "utf8",
    );

    assert.match(footer, /"use client"/);
    assert.match(footer, /isLoading=\{isLoading\}/);
    assert.match(footer, /Request check/);
    assert.match(modal, /isLoading=\{isLoading\}/);
    assert.doesNotMatch(modal, /setIsSubmitting/);
    assert.match(dialogs, /isLoading=\{isCartPending\}/);
  });
});
