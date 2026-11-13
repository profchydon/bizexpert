import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("Button loading state", () => {
  it("keeps full opacity while loading so the spinner stays visible", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/ui/button.tsx"),
      "utf8",
    );

    assert.match(source, /isLoading && "disabled:opacity-100"/);
    assert.match(source, /text-current/);
  });
});

describe("StatusActionModal", () => {
  it("blocks dismiss while card capture redirect is in progress", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/StatusActionModal.tsx",
      ),
      "utf8",
    );

    assert.match(source, /confirmPending/);
    assert.match(source, /confirmLoading/);
    assert.match(source, /if \(!open && !confirmLoading\) handleClose\(\)/);
    assert.match(source, /onPointerDownOutside/);
    assert.match(source, /onEscapeKeyDown/);
    assert.match(source, /isLoading={confirmLoading}/);
    assert.match(source, /disabled={confirmLoading}/);
    assert.match(source, /Redirecting…/);
    assert.match(source, /className="w-full"/);
    assert.doesNotMatch(source, /CardSetupReturnLoading/);
  });
});
