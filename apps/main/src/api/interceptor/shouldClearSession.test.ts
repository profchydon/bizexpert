import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { shouldClearSession } from "./shouldClearSession.ts";

describe("shouldClearSession", () => {
  it("clears the session on a 401", () => {
    assert.equal(shouldClearSession(401, { message: "Unauthorized" }), true);
  });

  it("keeps the session on a 403, which means forbidden, not expired", () => {
    assert.equal(
      shouldClearSession(403, {
        message: "You do not have access to this office or its resources.",
      }),
      false,
    );
  });

  it("keeps the session on other error statuses", () => {
    assert.equal(
      shouldClearSession(422, { message: "Validation error" }),
      false,
    );
    assert.equal(shouldClearSession(404, { message: "Not found" }), false);
    assert.equal(shouldClearSession(500, null), false);
    assert.equal(shouldClearSession(undefined, undefined), false);
  });

  it("still clears when the body says Unauthenticated at any status", () => {
    assert.equal(shouldClearSession(403, "Unauthenticated"), true);
    assert.equal(shouldClearSession(419, { message: "Unauthenticated" }), true);
  });

  it("matches the Unauthenticated marker regardless of case or padding", () => {
    assert.equal(shouldClearSession(403, "  unauthenticated  "), true);
    assert.equal(shouldClearSession(403, { message: "UNAUTHENTICATED" }), true);
  });

  it("does not confuse a message that merely mentions access", () => {
    assert.equal(
      shouldClearSession(403, { message: "Unauthenticated user detected" }),
      false,
    );
  });
});

describe("axiosBaseQuery session handling", () => {
  const source = readFileSync(
    join(process.cwd(), "src/api/interceptor/axiosBaseQuery.ts"),
    "utf8",
  );

  it("decides through the shared helper rather than inline status checks", () => {
    assert.match(
      source,
      /shouldClearSession\(err\.response\?\.status, err\.response\?\.data\)/,
    );
  });

  it("no longer treats 403 as a dead session", () => {
    assert.doesNotMatch(source, /err\.response\?\.status === 403/);
  });

  it("still tears down auth and dependent slices when it does clear", () => {
    assert.match(source, /unsetAuth\(\)/);
    assert.match(source, /resetOnboardingData\(\)/);
    assert.match(source, /resetEquipEmployeeState\(\)/);
  });
});
