import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/components/wizard/WizardStepIndicator.tsx",
  ),
  "utf8",
);

describe("WizardStepIndicator", () => {
  it("matches the reference numbered rail with hidden labels on small screens", () => {
    assert.match(
      source,
      /hidden shrink-0 text-sm font-medium transition sm:inline/,
    );
    assert.match(source, /flex items-center gap-3/);
    assert.match(source, /h-px flex-1 transition/);
    assert.doesNotMatch(source, /mx-1 h-px/);
  });
});
