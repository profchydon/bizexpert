import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const CATALOG_KIT_FILES = [
  "src/hooks/useCatalog.ts",
  "src/container/Dashboard/Catalogs/CatalogLayout/index.tsx",
  "src/container/Dashboard/CatalogPolicies/useCatalogPolicyOptions.ts",
  "src/container/Dashboard/CatalogPolicies/useCatalogPolicyPageState.ts",
  "src/container/Dashboard/CatalogPolicies/components/wizard/ApproverSelect.tsx",
  "src/container/Dashboard/Kits/KitLibraryPage.tsx",
  "src/container/Dashboard/Kits/components/DuplicateKitDialog.tsx",
  "src/container/Dashboard/Approvals/useApprovalsState.ts",
  "src/container/Dashboard/Approvals/useApprovalOrderSummaryNavigation.ts",
  "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
  "src/components/Drawers/PaymentMethods/TotalAmountSummary.tsx",
];

describe("workspaceCatalogKitCompanyId", () => {
  for (const filePath of CATALOG_KIT_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
      assert.doesNotMatch(source, /fetchAllSourceItems\(company\.id/);
    });
  }
});
