import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { buildEquipmentTableQueryFilters } from "./equipmentFilterQuery";
import {
  EMPTY_EQUIPMENT_FILTER_VALUES,
  normalizeEquipmentFilterValues,
} from "./equipmentFilterOptions";

describe("equipment filter slideout", () => {
  it("uses reference SlideoutMenu shell and base filter components", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/Drawers/FilterAllEquipments/index.tsx",
      ),
      "utf8",
    );
    const fields = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/Drawers/FilterAllEquipments/EquipmentFilterFields.tsx",
      ),
      "utf8",
    );
    const table = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /SlideoutMenu/);
    assert.match(slideout, /SlideoutMenu\.Header/);
    assert.match(slideout, /SlideoutMenu\.Footer/);
    assert.match(slideout, /Clear filter/);
    assert.match(slideout, /onApply\(EMPTY_EQUIPMENT_FILTER_VALUES\)/);
    assert.match(slideout, /isApplying/);
    assert.doesNotMatch(slideout, /DrawerRight/);
    assert.match(fields, /Checkbox/);
    assert.match(fields, /EquipmentFilterMultiField/);
    assert.match(fields, /Loader/);
    assert.doesNotMatch(fields, /Autocomplete/);
    assert.doesNotMatch(
      table,
      /toggleFilterEquipments\(\);\s*setIsApplyFilter\(false\)/,
    );
  });

  it("normalizes empty equipment filter values", () => {
    assert.deepEqual(
      normalizeEquipmentFilterValues(undefined),
      EMPTY_EQUIPMENT_FILTER_VALUES,
    );
  });

  it("builds equipment table query filters from applied values", () => {
    assert.deepEqual(
      buildEquipmentTableQueryFilters({
        selectedAssetTypes: ["Laptop/Workstation"],
        selectedStatus: ["assigned", "unassigned"],
        selectedStorage: [{ value: "256GB", label: "256GB SSD" }],
        selectedRam: [{ value: "16GB", label: "16GB" }],
        selectedCountries: [{ value: "1", label: "United States" }],
      }),
      {
        type: "Laptop/Workstation",
        status: "assigned,unassigned",
        storage: "256GB",
        memory: "16GB",
        country: "United States",
      },
    );
  });
});
