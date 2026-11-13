import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "WizardStepCurrencyLock.tsx"), "utf8");

describe("WizardStepCurrencyLock", () => {
  it("matches the reference copy and layout without a separate currency card", () => {
    assert.match(source, /This currency is permanent/);
    assert.match(source, /will be locked as this entity/);
    assert.match(source, /I understand \{currencyLabel\} is permanent/);
    assert.match(
      source,
      /You can still go back and change the currency until you confirm/,
    );
    assert.doesNotMatch(source, /Selected billing currency/);
    assert.doesNotMatch(source, /border border-warning-200/);
  });
});
