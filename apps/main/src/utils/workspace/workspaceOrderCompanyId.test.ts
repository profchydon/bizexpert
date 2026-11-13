import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const ORDER_FLOW_FILES = [
  "src/container/Dashboard/Orders/ViewOrder/useOrderData.ts",
  "src/container/Dashboard/Orders/ViewOrder/OrderUpdates/index.tsx",
  "src/container/Dashboard/Orders/ViewOrder/v2/table/useOrderInfoTableV2.ts",
  "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/index.tsx",
  "src/container/Dashboard/Orders/OrdersTable/index.tsx",
  "src/hooks/order/useOrders.ts",
  "src/components/Drawers/ExportOrder.tsx",
  "src/components/Drawers/OrderDetailItem/index.tsx",
  "src/components/Drawers/OrderDetailItem/ReferenceOrderItemSlideout.tsx",
  "src/components/Drawers/IndividualEmployee/ReferenceEmployeeSlideout.tsx",
  "src/components/Drawers/IndividualEmployee/OnboardingInstance.tsx",
  "src/components/Drawers/IndividualEmployee/OffboardingInstance.tsx",
];

describe("workspaceOrderCompanyId", () => {
  it("useOrderChat receives scoped company id from order detail tabs", () => {
    const source = readFileSync(
      "src/container/Dashboard/Orders/ViewOrder/v2/OrderDetailTabsV2.tsx",
      "utf8",
    );
    assert.match(source, /companyId: orderCompanyId/);
  });

  for (const filePath of ORDER_FLOW_FILES) {
    it(`${filePath} resolves order API company ids from workspace scope`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(
        source,
        /useWorkspaceCompanyId|useOrderScopedCompanyId|resolveOrderScopedCompanyId/,
      );
    });
  }
});
