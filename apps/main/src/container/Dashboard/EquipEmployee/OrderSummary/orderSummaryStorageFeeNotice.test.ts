import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const orderSummary = join(
  process.cwd(),
  "src/container/Dashboard/EquipEmployee/OrderSummary",
);

const read = (file: string) => readFileSync(join(orderSummary, file), "utf8");

describe("order summary storage fee notice", () => {
  it("does not render the first-month storage banner", () => {
    const layout = read("OrderSummaryLayout.tsx");
    const view = read("OrderSummaryUpdatedView.tsx");
    const page = read("OrderSummaryUpdated.tsx");
    const hook = readFileSync(
      join(process.cwd(), "src/hooks/useOnboardFeeAction.tsx"),
      "utf8",
    );

    assert.equal(existsSync(join(orderSummary, "StorageFeeNotice.tsx")), false);
    assert.doesNotMatch(layout, /StorageFeeNotice/);
    assert.doesNotMatch(layout, /Storage is free for the first month/);
    assert.doesNotMatch(layout, /unitStorageFees/);
    assert.doesNotMatch(view, /unitStorageFees/);
    assert.doesNotMatch(page, /unitStorageFees/);
    assert.doesNotMatch(hook, /unitStorageFees/);
  });
});
