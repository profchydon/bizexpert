import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import { ERROR_TOAST_DURATION_MS } from "./displayErrorMessage";

const source = readFileSync(
  join(process.cwd(), "src/utils/displayErrorMessage.tsx"),
  "utf8",
);

describe("displayErrorMessage", () => {
  it("keeps error toasts visible for ten seconds", () => {
    assert.equal(ERROR_TOAST_DURATION_MS, 10000);
  });

  it("wraps the message in one column and skips a redundant description", () => {
    assert.match(source, /minmax\(0, 1fr\)/);
    assert.match(source, /isRedundantErrorDescription\(message, description\)/);
  });
});
