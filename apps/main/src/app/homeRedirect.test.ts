import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("home page sends BizExpert users to login", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  assert.match(source, /isBizExpertApp\(\)/);
  assert.match(source, /redirect\(routes\.LOGIN\)/);
});

test("Rayda onboarding index sends BizExpert users to login", () => {
  const source = readFileSync("src/app/onboarding/page.tsx", "utf8");
  assert.match(source, /isBizExpertApp\(\)/);
  assert.match(source, /redirect\(routes\.LOGIN\)/);
});
