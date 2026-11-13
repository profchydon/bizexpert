import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("HrisFinchManageModal", () => {
  it("restores the Finch manage modal outside the slideout shell", () => {
    const addEmployees = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/index.tsx",
      ),
      "utf8",
    );
    const hris = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/HrisIntegrations.tsx",
      ),
      "utf8",
    );
    const modal = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/hris/HrisFinchManageModal.tsx",
      ),
      "utf8",
    );

    assert.match(addEmployees, /HrisFinchManageModal/);
    assert.match(addEmployees, /isOpen && !finchManage/);
    assert.match(modal, /<Finch isOpen/);
    assert.match(hris, /onOpenFinchManage/);
    assert.match(hris, /resolveHrisFinchOpenState/);
    assert.match(hris, /!onOpenFinchManage/);
    assert.match(hris, /prevFinchManageOpenRef/);
    assert.match(hris, /buildHrisTabQueryWithoutIntegrationParams/);
    assert.doesNotMatch(hris, /finchManageOpen \|\| !openIntegration/);
  });
});
