import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const ASSET_VAULT_FILES = [
  "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
  "src/container/Dashboard/AllEquipments/ViewEquipment/index.tsx",
  "src/container/Dashboard/AllEquipments/ViewEquipment/useEquipmentAdjacentNavigation.ts",
  "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentTabs.tsx",
  "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/index.tsx",
  "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/useEquipmentSidebarActions.ts",
  "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/index.tsx",
  "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
  "src/container/Dashboard/AllEquipments/Drawers/useSingleEquipmentEditForm.ts",
  "src/container/Dashboard/AllEquipments/DeviceRefresh/CountriesTable/index.tsx",
];

describe("workspaceAssetVaultCompanyId", () => {
  for (const filePath of ASSET_VAULT_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
      assert.doesNotMatch(source, /companyId=\{company\?\.id/);
      assert.doesNotMatch(source, /buildCreateEquipmentPayload\(company\.id/);
      assert.doesNotMatch(source, /buildEditEquipmentPayload\(\s*company\.id/);
    });
  }
});
