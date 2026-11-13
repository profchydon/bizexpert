import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { authorizationHeader } from "./authorizationHeader.ts";

describe("authorizationHeader", () => {
  it("sends bearer when a token is present", () => {
    assert.deepEqual(authorizationHeader("abc123"), {
      Authorization: "Bearer abc123",
    });
  });

  it("omits the header when skipAuth is true", () => {
    assert.deepEqual(authorizationHeader("abc123", true), {});
  });

  it("omits the header when the token is missing or blank", () => {
    assert.deepEqual(authorizationHeader(undefined), {});
    assert.deepEqual(authorizationHeader(null), {});
    assert.deepEqual(authorizationHeader(""), {});
    assert.deepEqual(authorizationHeader("   "), {});
  });
});

describe("axiosBaseQuery authorization", () => {
  const source = readFileSync(
    join(process.cwd(), "src/api/interceptor/axiosBaseQuery.ts"),
    "utf8",
  );

  it("builds the header through the shared helper", () => {
    assert.match(source, /authorizationHeader\(userToken, skipAuth\)/);
    assert.doesNotMatch(source, /Bearer \$\{userToken \|\| ""\}/);
  });
});
