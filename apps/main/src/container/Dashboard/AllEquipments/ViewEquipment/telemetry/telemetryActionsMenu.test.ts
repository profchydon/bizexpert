import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("employee-owned actions keep add note and stop telemetry", () => {
  const source = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/EquipmentDetailsActions.tsx",
    "utf8",
  );
  assert.match(source, /Stop telemetry/);
  assert.match(source, /Restore telemetry/);
  assert.match(source, /RevokeTelemetryModal/);
  assert.match(source, /employeeOwned/);
});

test("agent setup never offers MDM on personal devices", () => {
  const source = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/telemetry/ui/AgentSetupState.tsx",
    "utf8",
  );
  assert.match(source, /canUseMdm = !employeeOwned/);
  assert.match(source, /PersonalScopeNote/);
  assert.match(source, /MdmDeploymentCard/);
});
