import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const TRANSACTION_FLOW_FILES = [
  "src/container/Dashboard/Transactions/TransactionNestedPages/index.tsx",
  "src/container/Dashboard/Transactions/TransactionDetails/index.tsx",
  "src/container/Dashboard/Approvals/useApprovalPaymentVerification.ts",
  "src/container/Dashboard/AllEquipments/DeviceRefresh/OrderSummary/DeviceRefreshOrderSummary.tsx",
  "src/container/Dashboard/AllEquipments/DeviceRefresh/CountriesTable/index.tsx",
];

describe("workspaceTransactionCompanyId", () => {
  for (const filePath of TRANSACTION_FLOW_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for transaction API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
    });
  }
});
