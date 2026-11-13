import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const FLOW_FILES = [
  "src/container/Dashboard/EquipEmployee/Employee/SelectEmployee.tsx",
  "src/container/Dashboard/EquipEmployee/AssignmentFlow/index.tsx",
  "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployee/index.tsx",
  "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeEditRoleFields.tsx",
  "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeTable.tsx",
  "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/HrisIntegrations.tsx",
  "src/container/Dashboard/EquipEmployee/Marketplace/CustomDeviceRequestModal/index.tsx",
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryUpdated.tsx",
  "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryLegacy.tsx",
  "src/container/Dashboard/Storage/StorageLegacy.tsx",
  "src/container/Dashboard/Storage/ViewStorageCountry/AllEquipmentsTable/index.tsx",
  "src/container/Dashboard/Storage/ItemsByType/index.tsx",
  "src/container/Dashboard/Storage/OrderSummary/index.tsx",
  "src/container/Dashboard/Storage/SelectEmployees/EmployeesTable/index.tsx",
  "src/container/Dashboard/Employees/OffboardDevices/index.tsx",
  "src/container/Dashboard/Employees/OffboardDevices/AddEmployeesModal.tsx",
  "src/container/Dashboard/Employees/OffboardDevices/ReassignTargetPicker.tsx",
  "src/components/Offboarding/OrderSummary/index.tsx",
  "src/components/Offboarding/OrderSummary/OffboardingOrderSummaryLegacy.tsx",
  "src/components/Offboarding/OrderSummary/ModifyOrder/index.tsx",
  "src/components/Offboarding/ViewActions/ViewTransferActionsTable/index.tsx",
  "src/components/Offboarding/ViewActions/ViewSalesActionTable/index.tsx",
  "src/container/Dashboard/ImportEquipmentStorage/StorageTable/index.tsx",
  "src/container/Dashboard/ImportEquipmentStorage/OrderSummary/index.tsx",
  "src/container/Dashboard/ImportEquipmentStorage/Drawers/AddEquipments/ImportLayout/UploadEquipmentTable.tsx",
  "src/components/Drawers/EmployeeCartOverview/index.tsx",
];

describe("workspaceFlowCompanyId", () => {
  for (const filePath of FLOW_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
    });
  }
});
