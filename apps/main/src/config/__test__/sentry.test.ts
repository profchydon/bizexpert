import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getSentryEnvironment } from "../sentry";

describe("getSentryEnvironment", () => {
  it("uses the same app environments as feature flags", () => {
    assert.equal(getSentryEnvironment("production"), "production");
    assert.equal(getSentryEnvironment("staging"), "staging");
    assert.equal(getSentryEnvironment("development"), "development");
  });

  it("falls back to development for unknown values", () => {
    assert.equal(getSentryEnvironment("test"), "development");
    assert.equal(getSentryEnvironment(undefined), "development");
  });
});
