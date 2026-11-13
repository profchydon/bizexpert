import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  resolveAssetTypeSelectValue,
  toAssetTypeOptions,
} from "./assetTypeSelect";

const apiTypes = [
  { id: "9e3024c8-3a5b-4aea-8967-db2dc7b3073b", name: "Phones" },
  { id: "9e3024c8-3fdb-45ec-aa16-ed86167b55d3", name: "Tablet" },
  { id: "9e3024c8-3d7d-44cc-9569-2fc4d1ee41c6", name: "Accessories" },
  { id: "b8474d7e-1790-4698-97d2-624c8c41a024", name: "Macbook" },
  { id: "9e3024c8-337e-445c-b0bd-728ddbc75c09", name: "Laptop/Workstation" },
  { id: "5356893f-130c-480c-b7fe-71c50817e2b4", name: "Computer" },
];

describe("toAssetTypeOptions", () => {
  it("keeps every type from GET /assets/types", () => {
    assert.deepEqual(
      toAssetTypeOptions(apiTypes).map((type) => type.name),
      [
        "Phones",
        "Tablet",
        "Accessories",
        "Macbook",
        "Laptop/Workstation",
        "Computer",
      ],
    );
  });

  it("drops blank rows", () => {
    assert.deepEqual(
      toAssetTypeOptions([{ id: "", name: "Phones" }, apiTypes[0]!]),
      [apiTypes[0]],
    );
  });
});

describe("resolveAssetTypeSelectValue", () => {
  it("maps an asset-type id to its name", () => {
    assert.equal(
      resolveAssetTypeSelectValue(
        "b8474d7e-1790-4698-97d2-624c8c41a024",
        apiTypes,
      ),
      "Macbook",
    );
  });

  it("keeps a name that is already in the list", () => {
    assert.equal(resolveAssetTypeSelectValue("Computer", apiTypes), "Computer");
  });

  it("returns empty when no current type is set", () => {
    assert.equal(resolveAssetTypeSelectValue("", apiTypes), "");
    assert.equal(resolveAssetTypeSelectValue(undefined, apiTypes), "");
  });
});

describe("equipment asset type wiring", () => {
  it("loads create and edit options from GET /assets/types", () => {
    const query = readFileSync(
      "src/api/baseQueries/assetsApi/getAssetTypes.ts",
      "utf8",
    );
    const api = readFileSync("src/api/baseQueries/assetsApi/index.ts", "utf8");
    const form = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipment/index.tsx",
      "utf8",
    );
    const core = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/SingleEquipmentEditCoreFields.tsx",
      "utf8",
    );
    const hook = readFileSync(
      "src/container/Dashboard/AllEquipments/Drawers/useEquipmentTypeSelectItems.ts",
      "utf8",
    );

    assert.match(api, /baseUrl: `\$\{config\.API_URL!\}`/);
    assert.match(query, /url: `\/assets\/types`/);
    assert.match(form, /useGetAssetTypesQuery/);
    assert.match(form, /EquipmentAssetTypeOptions/);
    assert.doesNotMatch(form, /from \"@\/utils\/equipmentType\"/);
    assert.match(core, /useEquipmentTypeSelectItems/);
    assert.match(hook, /useGetAssetTypesQuery/);
    assert.doesNotMatch(core, /EQUIPMENT_TYPE_ITEMS/);
  });
});
