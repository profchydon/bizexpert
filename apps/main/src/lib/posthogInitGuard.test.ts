import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  POSTHOG_SESSION_RECORDING,
  resolvePostHogInitDecision,
} from "./posthogInitGuard";

describe("resolvePostHogInitDecision", () => {
  it("initializes when the PostHog key is present", () => {
    assert.equal(resolvePostHogInitDecision("phc_test", "development"), "init");
    assert.equal(resolvePostHogInitDecision("phc_test", "production"), "init");
  });

  it("flags a missing key in non-production environments", () => {
    assert.equal(
      resolvePostHogInitDecision(undefined, "development"),
      "missing-dev",
    );
    assert.equal(resolvePostHogInitDecision("", "staging"), "missing-dev");
  });

  it("flags a missing key in production without treating it as a dev error", () => {
    assert.equal(
      resolvePostHogInitDecision(undefined, "production"),
      "missing-prod",
    );
  });
});

describe("POSTHOG_SESSION_RECORDING", () => {
  it("masks password and tel inputs plus tagged text fields", () => {
    assert.deepEqual(POSTHOG_SESSION_RECORDING.maskInputOptions, {
      password: true,
      tel: true,
    });
    assert.equal(POSTHOG_SESSION_RECORDING.maskTextSelector, "[data-ph-mask]");
  });
});
