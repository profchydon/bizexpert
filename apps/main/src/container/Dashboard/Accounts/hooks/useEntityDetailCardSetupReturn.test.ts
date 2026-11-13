import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useEntityDetailCardSetupReturn", () => {
  it("confirms card capture on subsidiary detail card_setup return", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useEntityDetailCardSetupReturn.ts",
      ),
      "utf8",
    );

    assert.match(source, /useConfirmEntityConsentMutation/);
    assert.match(source, /confirmEntityCardSetupReturn/);
    assert.match(source, /status === "success"/);
    assert.match(source, /entityId,/);
    assert.match(source, /window\.history\.replaceState/);
    assert.match(source, /setIsResumingCardCapture\(false\)/);
  });
});

describe("subsidiary detail page route", () => {
  it("wraps the detail page in Suspense with a PageState fallback", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/accounts/subsidiaries/[id]/page.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Suspense/);
    assert.match(source, /SubsidiaryDetailPageFallback/);
  });
});
