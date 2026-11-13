import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "src/container/Onboarding/Signup/signupLogin.ts"),
  "utf8",
);

describe("signup login", () => {
  it("only follows a safe redirect and surfaces authorization failures", () => {
    assert.match(source, /assignSafeRedirectUrl/);
    assert.match(source, /showApiError\(error\)/);
    assert.doesNotMatch(source, /router\.push\(res\.data\.redirect_url\)/);
  });
});
