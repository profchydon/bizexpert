import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("AccountsPage card setup return", () => {
  it("opens the create wizard with inline loading after card capture", () => {
    const source = readFileSync(
      join(process.cwd(), "src/container/Dashboard/Accounts/AccountsPage.tsx"),
      "utf8",
    );

    assert.match(source, /isResumingCardCapture/);
    assert.match(
      source,
      /wizardOpen = createOpen \|\| !!returnDone \|\| isResumingCardCapture/,
    );
    assert.match(source, /isResumingCardCapture={isResumingCardCapture}/);
    assert.doesNotMatch(source, /CardCaptureRedirectOverlay/);
  });
});
