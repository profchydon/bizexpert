import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  SECURITY_HEADER_SOURCE,
  securityHeaders,
} from "../securityHeaders.mjs";

const nextConfig = readFileSync("next.config.mjs", "utf8");

function header(key: string) {
  return securityHeaders.find((item) => item.key === key);
}

test("clickjacking headers deny framing this app", () => {
  assert.equal(header("X-Frame-Options")?.value, "DENY");
  assert.equal(
    header("Content-Security-Policy")?.value,
    "frame-ancestors 'none';",
  );
});

test("referrer and unused device permissions are locked down", () => {
  assert.equal(
    header("Referrer-Policy")?.value,
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    header("Permissions-Policy")?.value,
    "camera=(), microphone=(), geolocation=()",
  );
});

test("next config applies the headers to every route", () => {
  assert.match(nextConfig, /from "\.\/src\/config\/securityHeaders\.mjs"/);
  assert.match(nextConfig, /async headers\(\)/);
  assert.match(nextConfig, /source: SECURITY_HEADER_SOURCE/);
  assert.match(nextConfig, /headers: securityHeaders/);
  assert.equal(SECURITY_HEADER_SOURCE, "/(.*)");
});

test("the unused script-src CSP is not enabled", () => {
  assert.equal(nextConfig.includes("script-src"), false);
  assert.equal(nextConfig.includes("unsafe-eval"), false);
});
