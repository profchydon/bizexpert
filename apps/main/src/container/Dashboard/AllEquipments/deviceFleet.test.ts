import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DISCOVERED_TAB_ENABLED,
  FLEET_INSIGHTS_BUTTON_ENABLED,
  resolveAssetVaultTab,
  assetVaultTabHref,
} from "./assetVaultTab";

test("discovered tab is hidden and old urls fall back to equipment", () => {
  assert.equal(DISCOVERED_TAB_ENABLED, false);
  assert.equal(FLEET_INSIGHTS_BUTTON_ENABLED, false);
  assert.equal(
    resolveAssetVaultTab({
      get: (key: string) => (key === "tab" ? "discovered" : null),
    }),
    "equipment",
  );
  assert.equal(assetVaultTabHref("discovered"), "/dashboard/all-equipments");
});

test("a discovered deep link returns to equipment", () => {
  const page = readFileSync(
    "src/container/Dashboard/AllEquipments/AllEquipment.tsx",
    "utf8",
  );

  assert.match(page, /searchParams\.get\("tab"\) !== "discovered"/);
  assert.match(page, /DISCOVERED_TAB_ENABLED/);
  assert.match(page, /assetVaultTabHref\("equipment", activeEntityId\)/);
});

test("Device Fleet list hides the discovered tab and banner", () => {
  const tabs = readFileSync(
    "src/container/Dashboard/AllEquipments/AssetVaultTabs.tsx",
    "utf8",
  );
  const store = readFileSync(
    "src/container/Dashboard/AllEquipments/discovered/store.ts",
    "utf8",
  );
  const page = readFileSync(
    "src/container/Dashboard/AllEquipments/AllEquipment.tsx",
    "utf8",
  );
  const nav = readFileSync("src/app/dashboard/NavBar/NavItems.data.ts", "utf8");

  assert.match(
    tabs,
    /DISCOVERED_TAB_ENABLED && telemetry\.ready && telemetry\.on/,
  );
  assert.match(store, /skip: !DISCOVERED_TAB_ENABLED \|\| !companyId/);
  assert.match(page, /Device Fleet/);
  assert.match(
    page,
    /FLEET_INSIGHTS_BUTTON_ENABLED && fleetAccess\.ready && fleetAccess\.on/,
  );
  assert.match(nav, /Device Fleet/);
});

test("discovered table uses the local sticky action column helper", () => {
  const table = readFileSync(
    "src/container/Dashboard/AllEquipments/discovered/DiscoveredTable.tsx",
    "utf8",
  );
  const cell = readFileSync(
    "src/container/Dashboard/AllEquipments/discovered/DiscoveredDeviceCell.tsx",
    "utf8",
  );
  const helper = readFileSync(
    "src/container/Dashboard/AllEquipments/discovered/stickyActionColumn.ts",
    "utf8",
  );

  assert.match(table, /from "\.\/stickyActionColumn"/);
  assert.doesNotMatch(table, /@\/utils\/sticky-action-column/);
  assert.match(cell, /from "\.\/stickyActionColumn"/);
  assert.match(helper, /STICKY_ACTION_HEAD/);
  assert.match(helper, /STICKY_ACTION_CELL/);
});

test("discovered table uses the production bulk action bar", () => {
  const table = readFileSync(
    "src/container/Dashboard/AllEquipments/discovered/DiscoveredTable.tsx",
    "utf8",
  );
  const bar = readFileSync(
    "src/components/application/table/bulk-action-bar.tsx",
    "utf8",
  );

  assert.match(
    table,
    /from "@\/components\/application\/table\/bulk-action-bar"/,
  );
  assert.match(bar, /export function BulkActionBar/);
});
