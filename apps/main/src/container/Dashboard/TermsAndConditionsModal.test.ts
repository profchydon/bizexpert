import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const modal = readFileSync(
  "src/container/Dashboard/TermsAndConditionsModal.tsx",
  "utf8",
);

test("the terms dialog stays within the viewport on every screen", () => {
  assert.match(modal, /max-h-\[calc\(100dvh-2rem\)\]/);
  assert.match(modal, /w-\[calc\(100%-2rem\)\]/);
  assert.match(modal, /max-w-xl/);
  assert.equal(modal.includes("h-[calc(100%-30px)]"), false);
  assert.equal(modal.includes("min-w-[768px]"), false);
  assert.equal(modal.includes("min-w-[704px]"), false);
});

test("the title and the agreement action stay available while the copy scrolls", () => {
  assert.match(modal, /Terms and conditions/);
  assert.match(modal, /overflow-y-auto/);
  assert.match(modal, /shrink-0 border-t/);
});
