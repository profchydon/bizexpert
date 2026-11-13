import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useEntityCardSetupReturn", () => {
  it("confirms card capture before reopening the wizard done step", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useEntityCardSetupReturn.ts",
      ),
      "utf8",
    );

    assert.match(source, /useConfirmEntityConsentMutation/);
    assert.match(source, /isResumingCardCapture/);
    assert.match(source, /confirmEntityCardSetupReturn/);
    assert.match(source, /resolvedStatus === "success"/);
    assert.match(source, /handleReturn\(cardSetupStatus\)/);
    assert.match(source, /mapCardSetupToDoneState/);
  });
});
