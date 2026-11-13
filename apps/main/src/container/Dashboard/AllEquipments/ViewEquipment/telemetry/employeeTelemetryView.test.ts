import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("employee-owned view scores compliance only and withholds hardware inventory", () => {
  const source = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/telemetry/ui/EmployeeTelemetryView.tsx",
    "utf8",
  );
  assert.match(source, /getDeviceHealth\(telemetry, true\)/);
  assert.match(source, /NotCollectedCard/);
  assert.match(source, /reduced/);
  assert.doesNotMatch(source, /MdmDeploymentCard/);
  assert.doesNotMatch(source, /AppInventoryCard/);
  assert.doesNotMatch(source, /MemoryConsumersCard/);
});

test("withheld panel titles sit under the card heading", () => {
  const panel = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/telemetry/ui/WithheldPanel.tsx",
    "utf8",
  );
  const emptyState = readFileSync(
    "src/components/application/empty-state/empty-state.tsx",
    "utf8",
  );

  assert.match(panel, /EmptyState\.Title as="h3"/);
  assert.match(emptyState, /as\?: "h1" \| "h2" \| "h3" \| "h4"/);
});
