import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("ReferenceEmployeeSlideout footer", () => {
  it("uses DrawerRight in-flow footer instead of fixed overlay", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/IndividualEmployee/ReferenceEmployeeSlideout.tsx",
      ),
      "utf8",
    );

    assert.match(source, /hideSaveButton/);
    assert.match(source, /ReferenceSlideoutTracking/);
    assert.match(source, /cancelText="Close"/);
    assert.doesNotMatch(source, /hideDefaultFooterBtn/);
    assert.doesNotMatch(source, /fixed bottom-0 left-0 right-0/);
    assert.doesNotMatch(source, /mb-24/);
  });
});

describe("IndividualEmployee legacy drawer footer", () => {
  it("uses DrawerRight in-flow footer instead of fixed overlay", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/IndividualEmployee/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /hideSaveButton/);
    assert.doesNotMatch(source, /fixed bottom-0 left-0 right-0/);
  });
});
