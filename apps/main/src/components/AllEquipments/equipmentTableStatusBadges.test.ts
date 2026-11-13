import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  deriveEquipmentDeviceStatus,
  equipmentHasTelemetry,
} from "./equipmentTableDeviceStatus";
import { getRefreshWarrantyPresentation } from "./equipmentTableStatusBadges";

describe("equipmentTableStatusBadges", () => {
  it("maps refresh status to reference warranty badge colors", () => {
    assert.equal(getRefreshWarrantyPresentation("Due").color, "warning");
    assert.equal(getRefreshWarrantyPresentation("Overdue").color, "error");
    assert.equal(getRefreshWarrantyPresentation("Not Due").color, "gray");
    assert.equal(
      getRefreshWarrantyPresentation(undefined).label,
      "Not covered",
    );
  });

  it("derives active/inactive device status for telemetry-capable types", () => {
    assert.equal(deriveEquipmentDeviceStatus("assigned"), "active");
    assert.equal(deriveEquipmentDeviceStatus("unassigned"), "inactive");
    assert.equal(equipmentHasTelemetry("Laptop/Workstation"), true);
    assert.equal(equipmentHasTelemetry("Monitor"), false);
  });
});

describe("equipment table reference columns", () => {
  it("uses reference column set and cell modules", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/tableColumn.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Assigned to/);
    assert.match(source, /Location/);
    assert.match(source, /Warranty/);
    assert.doesNotMatch(source, /Purchase date/);
    assert.doesNotMatch(source, /Refresh status/);
    assert.match(source, /EquipmentTableDeviceStatusCell/);
  });

  it("uses reference table shell and base toolbar components", () => {
    const header = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/tableHeader.tsx",
      ),
      "utf8",
    );
    const index = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(header, /Badge size="sm" color="brand"/);
    const employeeSelect = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/EquipmentTableEmployeeSelect.tsx",
      ),
      "utf8",
    );

    assert.match(header, /ButtonGroup/);
    assert.match(header, /EquipmentTableEmployeeSelect/);
    assert.doesNotMatch(header, /Autocomplete/);
    assert.match(employeeSelect, /Select\.ComboBox/);
    assert.match(index, /equipmentTableShellClass/);
  });
});
