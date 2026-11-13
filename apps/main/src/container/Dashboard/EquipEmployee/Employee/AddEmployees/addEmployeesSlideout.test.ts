import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("AddEmployees slideout shell", () => {
  it("uses shared SlideoutMenu shell with divider and panel tabs", () => {
    const shell = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/addEmployeesSlideoutShell.tsx",
      ),
      "utf8",
    );
    const tabs = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/addEmployeesPanelTabs.tsx",
      ),
      "utf8",
    );
    const index = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/index.tsx",
      ),
      "utf8",
    );

    assert.match(shell, /AddEmployeesSlideoutShell/);
    assert.match(
      tabs,
      /Import employees[\s\S]*Add employee[\s\S]*HRIS integration/,
    );
    assert.match(tabs, /px-6 pt-1/);
    assert.match(shell, /hideTabs \?/);
    assert.match(index, /AddEmployeesSlideoutShell/);
    assert.match(index, /HrisIntegrations/);
    assert.doesNotMatch(index, /DrawerRight/);
    assert.doesNotMatch(index, /HrisIntegrationsSlideoutTab/);
  });
});

describe("Import employees slideout tab", () => {
  it("uses design-ui upload drop zone and slideout footer", () => {
    const upload = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeUploadPanel.tsx",
      ),
      "utf8",
    );
    const dropZone = readFileSync(
      join(
        process.cwd(),
        "src/components/application/file-upload/file-upload-drop-zone.tsx",
      ),
      "utf8",
    );
    const table = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeTable.tsx",
      ),
      "utf8",
    );

    assert.match(upload, /FileUpload\.DropZone/);
    assert.match(dropZone, /foundations\/featured-icon\/featured-icon/);
    assert.match(dropZone, /flex justify-center gap-1 text-center/);
    assert.match(dropZone, /openFilePicker\(\)/);
    assert.match(upload, /CSV or XLSX files only/);
    assert.match(upload, /Download template/);
    assert.doesNotMatch(upload, /AddEmployeesTabFooter/);
    assert.match(table, /ImportEmployeePreviewFooter/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeePreviewTable.tsx",
        ),
        "utf8",
      ),
      /importEmployeePreviewTableShellClass/,
    );
    assert.doesNotMatch(table, /fixed bottom-0/);
  });
});

describe("AddEmployeeSlideoutTab", () => {
  it("shows a tooltip reason when the save button is disabled", () => {
    const tab = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployeeSlideoutTab.tsx",
      ),
      "utf8",
    );

    assert.match(tab, /DisabledWithTooltip/);
    assert.match(tab, /saveDisabledReason/);
    assert.match(tab, /freeTextAddress/);
  });
});

describe("useAddEmployeeForm", () => {
  it("loads employees via RTK and reuses edit form field modules", () => {
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/useAddEmployeeForm.ts",
      ),
      "utf8",
    );
    const index = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/index.tsx",
      ),
      "utf8",
    );

    assert.match(hook, /useAddEmployeesMutation/);
    assert.match(hook, /buildEditEmployeeFormData/);
    assert.match(hook, /canSaveAddEmployee/);
    assert.match(hook, /getAddEmployeeSaveDisabledReason/);
    assert.match(hook, /useWorkspaceScopedCompanyArgs/);
    assert.match(index, /suppressRouteSync = true/);
    assert.match(hook, /buildAddEmployeeRouteQuery/);
    assert.match(hook, /subscription\.unsubscribe/);
    assert.doesNotMatch(hook, /router\.replace\(path, undefined\)/);
  });
});
