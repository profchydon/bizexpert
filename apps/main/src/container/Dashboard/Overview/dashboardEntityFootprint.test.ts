import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard, IDashboardEquipmentPanel } from "@/types/dashboard";
import {
  dashboardEquipmentPanel,
  dashboardOfficesPanel,
  equipmentConditionSlices,
  equipmentMixFromPanel,
  isDashboardEquipmentVisible,
  isDashboardOfficesVisible,
  officesAreasFromPanel,
} from "./dashboardEntityFootprint";

const equipment = (
  overrides: Partial<IDashboardEquipmentPanel> = {},
): IDashboardEquipmentPanel => ({
  total_assets: 12,
  in_storage: 3,
  asset_value: 4800,
  condition: { excellent: 6, good: 4, fair: 1, poor: 1 },
  mix_by_category: [
    { category: "Phones", count: 2 },
    { category: "Laptops", count: 8 },
  ],
  ...overrides,
});

test("equipment and offices panels are read from the dashboard payload", () => {
  const dashboard = {
    panels: {
      equipment: equipment(),
      offices: {
        total: 2,
        physical: 1,
        remote: 1,
        areas: [
          { name: "Lagos", count: 1 },
          { name: "Abuja", count: 3 },
        ],
      },
    },
  } as IDashboard;

  assert.equal(dashboardEquipmentPanel(dashboard)?.total_assets, 12);
  assert.equal(dashboardOfficesPanel(dashboard)?.physical, 1);
  assert.deepEqual(equipmentMixFromPanel(dashboardEquipmentPanel(dashboard)), [
    { category: "Laptops", count: 8 },
    { category: "Phones", count: 2 },
  ]);
  assert.deepEqual(officesAreasFromPanel(dashboardOfficesPanel(dashboard)), [
    { name: "Abuja", count: 3 },
    { name: "Lagos", count: 1 },
  ]);
});

test("empty entity equipment still lists the four condition buckets", () => {
  const slices = equipmentConditionSlices(
    equipment({
      total_assets: 0,
      in_storage: 0,
      asset_value: 0,
      condition: { excellent: 0, good: 0, fair: 0, poor: 0 },
      mix_by_category: [],
    }),
  );

  assert.deepEqual(
    slices.map((slice) => [slice.label, slice.value]),
    [
      ["Excellent", 0],
      ["Good", 0],
      ["Fair", 0],
      ["Poor", 0],
    ],
  );
  assert.equal(equipmentMixFromPanel(null).length, 0);
  assert.equal(officesAreasFromPanel(null).length, 0);
});

test("footprint cards follow access.visibility", () => {
  const hidden = {
    access: { visibility: { equipment: false, offices: false } },
  } as IDashboard;

  assert.equal(isDashboardEquipmentVisible(hidden), false);
  assert.equal(isDashboardOfficesVisible(hidden), false);
  assert.equal(isDashboardEquipmentVisible(undefined), true);
});
