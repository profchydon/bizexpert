import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  buildEquipmentRefreshDefaults,
  buildEquipmentRefreshList,
  isEquipmentRefreshSubmitEnabled,
  normalizeEquipmentRefreshKey,
} from "./equipmentRefreshForm";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Settings/EquipmentRefresh/index.tsx",
  ),
  "utf8",
);

describe("equipment refresh save", () => {
  it("normalizes types and builds the refresh list", () => {
    assert.equal(
      normalizeEquipmentRefreshKey("Laptop/Workstation"),
      "laptop_workstation",
    );

    const assets = [
      {
        id: "type-1",
        asset_type: "Phones",
        asset_type_id: "type-1",
        refresh_period_in_months: 24,
      },
    ];

    assert.deepEqual(buildEquipmentRefreshDefaults(assets), {
      phones: true,
      phonesRefreshPeriod: 2,
    });
    assert.equal(
      isEquipmentRefreshSubmitEnabled(assets, {
        phones: true,
        phonesRefreshPeriod: 2,
      }),
      true,
    );
    assert.deepEqual(
      buildEquipmentRefreshList(assets, {
        phones: true,
        phonesRefreshPeriod: 2,
      }),
      [{ asset_type_id: "type-1", refresh_period_in_months: 24 }],
    );
    assert.deepEqual(
      buildEquipmentRefreshList(undefined, { phones: true }),
      [],
    );
  });

  it("surfaces save failures instead of swallowing them or replacing the form", () => {
    assert.match(source, /IAssetRefreshItem & \{ id\?: string \}/);
    assert.match(
      source,
      /await createAssetRefreshConfig\(payload\)\.unwrap\(\)/,
    );
    assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
    assert.match(source, /showApiError\(error\)/);
    assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
    assert.doesNotMatch(source, /createAssetRefConfig_error/);
  });
});
