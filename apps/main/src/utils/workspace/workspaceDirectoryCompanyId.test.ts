import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const DIRECTORY_FILES = [
  "src/hooks/useDepartment.tsx",
  "src/hooks/useLevel.tsx",
  "src/components/JobTitleField.tsx",
  "src/components/LineManagerField.tsx",
  "src/components/DepartmentField.tsx",
  "src/components/LevelField.tsx",
  "src/container/Dashboard/Accounts/Offices/hooks/useOfficesServer.ts",
  "src/hooks/useOfficeDetailHref.ts",
  "src/container/Dashboard/Accounts/hooks/usePaginatedEmployees.ts",
  "src/container/Dashboard/Employees/EmployeesTable/index.tsx",
  "src/container/Dashboard/Employees/OnboardDevices/DevicePickerStorageTab.tsx",
  "src/container/Dashboard/Employees/OnboardDevices/usePolicyPrefill.ts",
  "src/container/Dashboard/Employees/EmployeeDetails/index.tsx",
  "src/container/Dashboard/Employees/EmployeeDetails/useLineManagerSelectItems.ts",
  "src/container/Dashboard/Department/DepartmentTable/index.tsx",
  "src/container/Dashboard/Department/Levels/LevelsTable/index.tsx",
];

describe("workspaceDirectoryCompanyId", () => {
  for (const filePath of DIRECTORY_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId for API company ids`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
      assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
    });
  }
});
