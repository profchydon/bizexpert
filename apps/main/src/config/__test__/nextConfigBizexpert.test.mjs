import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("next.config skips Sentry wrapper in BizExpert product mode", () => {
  const source = readFileSync("next.config.mjs", "utf8");
  assert.match(source, /NEXT_PUBLIC_PRODUCT === "bizexpert"/);
  assert.match(source, /isBizExpert \? nextConfig : sentryConfig/);
  assert.match(source, /require-in-the-middle/);
});
