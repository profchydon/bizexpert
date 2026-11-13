import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  employeeRowsFromListResponse,
  employeesForSelectedCountry,
  equipmentAssigneeEmployeeParams,
  findEquipmentCountryRecord,
  shouldClearAssignee,
} from "./equipmentAssigneeByCountry";

describe("equipmentAssigneeByCountry", () => {
  const nigeria = {
    id: "country-ng",
    name: "Nigeria",
    code: "NG",
  };

  it("resolves the selected country record by name", () => {
    assert.equal(
      findEquipmentCountryRecord([nigeria as never], "Nigeria")?.id,
      "country-ng",
    );
    assert.equal(
      findEquipmentCountryRecord([nigeria as never], "  "),
      undefined,
    );
  });

  it("sends country_id and country_code on the employees request", () => {
    assert.deepEqual(equipmentAssigneeEmployeeParams(nigeria), {
      paginate: false,
      country_id: "country-ng",
      country_code: "NG",
    });
    assert.deepEqual(equipmentAssigneeEmployeeParams(undefined), {
      paginate: false,
    });
  });

  it("keeps only employees in the selected country", () => {
    const employees = [
      { id: "1", country: "Nigeria" },
      { id: "2", country: "United Kingdom" },
    ];

    assert.deepEqual(employeesForSelectedCountry(employees, "Nigeria"), [
      { id: "1", country: "Nigeria" },
    ]);
  });

  it("reads employees from a raw array or paginated payload", () => {
    const rows = [{ id: "1", country: "United Kingdom" }];
    assert.deepEqual(employeeRowsFromListResponse({ data: rows }), rows);
    assert.deepEqual(
      employeeRowsFromListResponse({ data: { data: rows, total: 1 } }),
      rows,
    );
  });

  it("builds different employee params for different countries", () => {
    const unitedKingdom = {
      id: "country-gb",
      name: "United Kingdom",
      code: "GB",
    };

    assert.deepEqual(equipmentAssigneeEmployeeParams(unitedKingdom), {
      paginate: false,
      country_id: "country-gb",
      country_code: "GB",
    });
    assert.deepEqual(equipmentAssigneeEmployeeParams(nigeria), {
      paginate: false,
      country_id: "country-ng",
      country_code: "NG",
    });
    assert.notDeepEqual(
      equipmentAssigneeEmployeeParams(unitedKingdom),
      equipmentAssigneeEmployeeParams(nigeria),
    );
  });

  it("clears an assignee when the new country list does not include them", () => {
    assert.equal(shouldClearAssignee("emp-gb", ["emp-ng"], true), true);
    assert.equal(
      shouldClearAssignee("emp-gb", ["emp-gb", "emp-ng"], true),
      false,
    );
    assert.equal(shouldClearAssignee("emp-gb", ["emp-ng"], false), false);
    assert.equal(shouldClearAssignee("", ["emp-ng"], true), false);
  });
});

describe("equipment assignee wiring", () => {
  it("filters add and import assignee options by the form country", () => {
    const addHook = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
      "utf8",
    );
    const importHook = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/EditImportedEquipment/useEditImportedEquipmentForm.ts",
      "utf8",
    );
    const optionsHook = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useEquipmentAssigneeOptions.ts",
      "utf8",
    );

    assert.match(addHook, /useEquipmentAssigneeOptions/);
    assert.match(importHook, /useEquipmentAssigneeOptions/);
    assert.match(optionsHook, /skip: !companyId \|\| !selectedCountry/);
    assert.match(optionsHook, /equipmentAssigneeEmployeeParams/);
    assert.match(optionsHook, /employeesForSelectedCountry/);
    assert.match(addHook, /shouldClearAssignee/);
    assert.match(importHook, /shouldClearAssignee/);
  });
});
