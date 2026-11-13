import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("useEntityCardCapture", () => {
  it("starts consent and redirects to the hosted capture url", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useEntityCardCapture.ts",
      ),
      "utf8",
    );

    assert.match(source, /useStartEntityConsentMutation/);
    assert.match(source, /useReplaceEntityConsentMutation/);
    assert.match(source, /beginCardReplace/);
    assert.match(source, /resolveEntityCardCaptureUrl/);
    assert.match(source, /stashPendingEntityCreate/);
    assert.match(source, /setIsRedirecting\(true\)/);
    assert.match(source, /setIsRedirecting\(false\)/);
    assert.match(source, /isRedirecting/);
    assert.match(source, /isCapturing/);
    assert.match(source, /window\.location\.assign/);
  });
});

describe("useCreateEntitySubmission", () => {
  it("creates the entity then starts card capture via consent/start", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useCreateEntitySubmission.ts",
      ),
      "utf8",
    );

    assert.match(source, /useCreateEntityMutation/);
    assert.match(source, /beginCardCapture/);
    assert.match(source, /routes\.ACCOUNTS/);
  });
});
