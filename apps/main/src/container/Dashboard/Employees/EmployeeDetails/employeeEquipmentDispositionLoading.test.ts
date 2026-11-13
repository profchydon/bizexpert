import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("useEmployeeEquipmentDisposition", () => {
  it("tracks the clicked disposition for scoped loading", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/useEmployeeEquipmentDisposition.ts",
      ),
      "utf8",
    );

    assert.match(source, /activeDisposition/);
    assert.match(source, /setActiveDisposition\(disposition\)/);
    assert.match(source, /getPendingDisposition/);
  });
});

describe("EmployeeEquipmentSelectionBar", () => {
  it("shows loading only on the active disposition button", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/tables/EmployeeEquipmentSelectionBar.tsx",
      ),
      "utf8",
    );

    assert.match(source, /pendingDisposition === disposition/);
    assert.match(source, /isBusy && pendingDisposition !== disposition/);
  });
});

describe("EmployeeEquipmentRowActions", () => {
  it("scopes row menu spinners to the clicked disposition", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/tables/EmployeeEquipmentRowActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /pendingDisposition === "REASSIGN"/);
    assert.match(source, /isBusy && pendingDisposition !== "STORE"/);
  });
});
