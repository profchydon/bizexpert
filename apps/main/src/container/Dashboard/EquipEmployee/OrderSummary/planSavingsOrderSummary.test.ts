import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("plan savings on checkout order summary", () => {
  it("mounts the card callout above Proceed to Payment", () => {
    const layout = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryLayout.tsx",
      ),
      "utf8",
    );

    assert.match(layout, /PlanSavingsCallout/);
    assert.match(layout, /variant="card"/);
    assert.match(layout, /readSubscriberSaving\(totalFeesSummary\)/);
    assert.match(layout, /Proceed to Payment/);

    const calloutIndex = layout.indexOf("PlanSavingsCallout");
    const buttonIndex = layout.indexOf("Proceed to Payment");
    assert.ok(calloutIndex > 0 && calloutIndex < buttonIndex);
  });

  it("does not add the callout to offboarding or storage-only summaries", () => {
    const offboarding = readFileSync(
      join(
        process.cwd(),
        "src/components/Offboarding/OrderSummary/OrderSummaryLayout.tsx",
      ),
      "utf8",
    );
    const storage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/OrderSummary/OrderSummaryLayout.tsx",
      ),
      "utf8",
    );
    const importStorage = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/ImportEquipmentStorage/OrderSummary/OrderSummaryLayout.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(offboarding, /PlanSavingsCallout/);
    assert.doesNotMatch(storage, /PlanSavingsCallout/);
    assert.doesNotMatch(importStorage, /PlanSavingsCallout/);
  });
});
