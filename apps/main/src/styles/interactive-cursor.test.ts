import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

test("interactive cursor styles apply pointer to semantic controls", () => {
  const source = readFileSync(
    join(process.cwd(), "src/styles/interactive-cursor.css"),
    "utf8",
  );

  assert.match(source, /button:not\(:disabled\)/);
  assert.match(source, /a:any-link/);
  assert.match(source, /\[role="menuitem"\]/);
  assert.match(source, /cursor: pointer/);
  assert.match(source, /cursor: not-allowed/);
});

test("globals.css imports interactive cursor layer", () => {
  const source = readFileSync(
    join(process.cwd(), "src/styles/globals.css"),
    "utf8",
  );

  assert.match(source, /@import "\.\/interactive-cursor\.css"/);
});
