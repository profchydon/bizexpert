import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildEquipmentDetailTabs } from "./equipmentDetailTabItems";

test("eligible types no longer include a telemetry tab", () => {
  const tabs = buildEquipmentDetailTabs({ type: "Laptop" } as never);
  assert.deepEqual(
    tabs.map((tab) => tab.id),
    ["overview", "documents", "notes"],
  );
});

test("accessories do not get a telemetry tab", () => {
  const tabs = buildEquipmentDetailTabs({ type: "Accessories" } as never);
  assert.equal(
    tabs.some((tab) => tab.id === "telemetry"),
    false,
  );
});

test("equipment tabs do not mount the telemetry panel", () => {
  const tabs = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentTabs.tsx",
    "utf8",
  );

  assert.doesNotMatch(tabs, /EquipmentTelemetryTab/);
  assert.doesNotMatch(tabs, /activeTab === "telemetry"/);
  assert.match(tabs, /resolveEquipmentDetailTab/);
});
