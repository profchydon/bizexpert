import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const read = (relative: string) =>
  readFileSync(join(process.cwd(), relative), "utf8");

const ORDER_SUMMARIES = [
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryUpdatedView.tsx",
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryLegacy.tsx",
  "src/container/Dashboard/Storage/OrderSummary/index.tsx",
  "src/container/Dashboard/ImportEquipmentStorage/OrderSummary/index.tsx",
  "src/container/Dashboard/AllEquipments/DeviceRefresh/OrderSummary/DeviceRefreshOrderSummary.tsx",
  "src/components/Offboarding/OrderSummary/index.tsx",
  "src/components/Offboarding/OrderSummary/OffboardingOrderSummaryLegacy.tsx",
];

describe("unified checkout drawer", () => {
  it("renders the Buy to Office checkout slideout from PaymentMethods", () => {
    const methods = read("src/components/Drawers/PaymentMethods/index.tsx");
    assert.match(methods, /OrderSummaryPaymentDrawer/);
    assert.doesNotMatch(methods, /DrawerRight/);
    assert.doesNotMatch(methods, /<Tabs/);
  });

  it("uses PaymentMethods on every order-summary checkout", () => {
    for (const file of ORDER_SUMMARIES) {
      const source = read(file);
      assert.match(
        source,
        /Drawers\/PaymentMethods/,
        `${file} should open the shared checkout drawer`,
      );
      assert.doesNotMatch(
        source,
        /OrderSummaryPaymentDrawer/,
        `${file} should go through PaymentMethods, not the drawer directly`,
      );
    }
  });
});
