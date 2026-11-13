import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "WizardModalFooter.tsx"), "utf8");

describe("WizardModalFooter", () => {
  it("places the hint beside Back on the left and actions on the right", () => {
    assert.match(source, /flex min-w-0 flex-1 items-center gap-3/);
    assert.doesNotMatch(source, /text-center/);
    assert.match(source, /ml-auto flex shrink-0 items-center gap-2/);
  });
});
