import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const offboardingAddressCard = join(
  process.cwd(),
  "src/components/Offboarding/OrderSummary/AddressCard.tsx",
);

const orderSummaryAddressCard = join(
  process.cwd(),
  "src/components/OrderSummary/AddressCard.tsx",
);

describe("AddressCard country rendering", () => {
  for (const [label, path] of [
    ["offboarding", offboardingAddressCard],
    ["order summary", orderSummaryAddressCard],
  ] as const) {
    it(`${label} AddressCard resolves nested country objects before render`, () => {
      const source = readFileSync(path, "utf8");

      assert.match(source, /resolveCountryText/);
      assert.match(source, /resolveCountryCode/);
      assert.match(source, /<span>\{countryLabel\}<\/span>/);
      assert.doesNotMatch(source, /<span>\{country \|\| ""\}<\/span>/);
    });
  }
});
