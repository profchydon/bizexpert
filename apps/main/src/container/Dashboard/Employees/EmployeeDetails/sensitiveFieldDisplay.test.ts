import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  displaySensitiveValue,
  hasSensitiveValue,
  maskedSensitiveValue,
  SENSITIVE_FIELD_EMPTY,
} from "./sensitiveFieldDisplay";

describe("sensitiveFieldDisplay", () => {
  it("treats blank and em dash values as empty", () => {
    assert.equal(hasSensitiveValue(""), false);
    assert.equal(hasSensitiveValue("   "), false);
    assert.equal(hasSensitiveValue(SENSITIVE_FIELD_EMPTY), false);
  });

  it("masks real values and shows em dash for empty values", () => {
    assert.equal(displaySensitiveValue(SENSITIVE_FIELD_EMPTY, false), "—");
    assert.equal(
      displaySensitiveValue("user@example.com", false),
      "••••••••••••••••",
    );
    assert.equal(
      displaySensitiveValue("user@example.com", true),
      "user@example.com",
    );
  });

  it("caps masked dots at eighteen characters", () => {
    assert.equal(
      maskedSensitiveValue("abcdefghijklmnopqrstuvwxyz"),
      "•".repeat(18),
    );
  });
});
