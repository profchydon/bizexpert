import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const files = [
  "src/container/Dashboard/Department/DeleteDepartmentModal.tsx",
  "src/container/Dashboard/Department/Levels/DeleteLevelModal.tsx",
  "src/container/Dashboard/Department/moveMembersActions.ts",
  "src/container/Dashboard/AllEquipments/Drawers/AddEquipmentNote/index.tsx",
  "src/container/Dashboard/Overview/index.tsx",
  "src/container/Onboarding/Signup/index.tsx",
  "src/container/Onboarding/CompanyProfile/index.tsx",
  "src/container/Onboarding/CompanyInformation/submitCompanyInformation.ts",
  "src/container/Onboarding/index.tsx",
  "src/components/LevelField.tsx",
  "src/components/DepartmentField.tsx",
  "src/container/Employee/Profile/PersonalInfo.tsx",
  "src/container/Dashboard/Catalogs/CreateCatalogs/index.tsx",
  "src/container/Dashboard/Catalogs/ViewCatalog/ConfigureCatalog/ItemQuantityConfig.tsx",
  "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipment/index.tsx",
  "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployee/index.tsx",
  "src/container/Dashboard/Approvals/components/ApprovalModal.tsx",
  "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/submitImportEquipmentBulk.ts",
  "src/container/Dashboard/Settings/Users/AddEmployee/SendInvite/index.tsx",
  "src/container/Dashboard/Overview/WhatsHappening/RecentPendingCatalogRequests/DeclineReason/index.tsx",
  "src/container/Dashboard/Catalogs/EmployeesRequest/DeclineReason/index.tsx",
  "src/container/Dashboard/ImportEquipmentStorage/OrderSummary/index.tsx",
];

describe("leftover empty catch", () => {
  for (const path of files) {
    it(`surfaces failures in ${path}`, () => {
      const source = read(path);
      assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
      assert.doesNotMatch(source, /\.catch\(\(\w+\) => \{\}\)/);
      assert.doesNotMatch(source, /\.catch\(\);/);
      assert.match(source, /showApiError/);
    });
  }
});
