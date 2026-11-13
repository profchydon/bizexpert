import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "SubOrderCancelModal.tsx"),
  "utf8",
);

test("order item cancel dialog stacks above the item drawer", () => {
  assert.match(source, /ELEVATED_MODAL_OVERLAY_CLASS/);
  assert.match(source, /ELEVATED_MODAL_CONTENT_CLASS/);
});
