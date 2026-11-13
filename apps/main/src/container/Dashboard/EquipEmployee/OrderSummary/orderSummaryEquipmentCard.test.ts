import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const card = readFileSync(
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryEquipmentCard.tsx",
  "utf8",
);
const layout = readFileSync(
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryLayout.tsx",
  "utf8",
);
const list = readFileSync(
  "src/container/Dashboard/EquipEmployee/OrderSummary/AssociatedDeviceList.tsx",
  "utf8",
);

describe("order summary equipment overflow", () => {
  it("wraps long names and descriptions instead of stretching columns", () => {
    assert.match(card, /break-words text-base font-medium text-gray-900/);
    assert.match(card, /break-words text-sm text-gray-500/);
    assert.match(card, /min-w-0 flex-1 flex-col/);
    assert.doesNotMatch(card, /truncate/);
  });

  it("lets the summary columns shrink so long copy cannot expand the page", () => {
    assert.match(layout, /w-full min-w-0 flex-col/);
    assert.match(layout, /min-w-0 flex-1 flex-col/);
    assert.match(layout, /min-w-0 flex-1/);
    assert.match(list, /min-w-0 overflow-hidden/);
  });
});
