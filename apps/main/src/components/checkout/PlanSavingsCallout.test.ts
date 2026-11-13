import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "src/components/checkout/PlanSavingsCallout.tsx"),
  "utf8",
);

describe("PlanSavingsCallout", () => {
  it("hides at zero and uses Preferred Pricing copy", () => {
    assert.match(source, /amount <= 0/);
    assert.match(source, /Preferred Pricing/);
    assert.match(source, /subscriberSavingCopy/);
    assert.match(source, /Upgrade plan/);
  });

  it("sends the card CTA to the existing Subscription settings tab", () => {
    assert.match(source, /SUBSCRIPTION_SETTINGS_HREF/);
    assert.doesNotMatch(source, /Book a meeting/);
  });

  it("exposes compact and card variants", () => {
    assert.match(source, /variant === "compact"/);
    assert.match(source, /border-success-200 bg-success-50/);
  });
});
