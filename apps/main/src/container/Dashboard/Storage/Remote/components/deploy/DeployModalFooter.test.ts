import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("DeployModalFooter", () => {
  it("binds Confirm deployment to the cart queue pending flag", () => {
    const footer = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/deploy/DeployModalFooter.tsx",
      "utf8",
    );
    const modal = readFileSync(
      "src/container/Dashboard/Storage/Remote/components/deploy/DeployToEmployeeModal.tsx",
      "utf8",
    );
    const flow = readFileSync(
      "src/container/Dashboard/Storage/Remote/hooks/useStoragePageCartFlow.ts",
      "utf8",
    );
    const dialogs = readFileSync(
      "src/container/Dashboard/Storage/Remote/StoragePageActionDialogs.tsx",
      "utf8",
    );

    assert.match(footer, /"use client"/);
    assert.match(footer, /isLoading=\{isLoading\}/);
    assert.match(footer, /Confirm deployment/);
    assert.match(modal, /isLoading=\{isLoading\}/);
    assert.match(dialogs, /isLoading=\{isCartPending\}/);
    assert.match(flow, /runWithPending/);
    assert.match(flow, /setIsCartPending/);
  });
});
