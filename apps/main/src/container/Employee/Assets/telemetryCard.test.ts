import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("employee asset detail renders TelemetryCard without MDM", () => {
  const card = readFileSync(
    "src/container/Employee/Assets/TelemetryCard.tsx",
    "utf8",
  );
  const detail = readFileSync(
    "src/container/Employee/Assets/AssetDetail.tsx",
    "utf8",
  );
  const page = readFileSync(
    "src/app/employee/assets/[assetId]/page.tsx",
    "utf8",
  );

  assert.match(card, /Set up the Rayda agent/);
  assert.match(card, /AgentInstallSteps/);
  assert.doesNotMatch(card, /MdmDeploymentCard/);
  assert.match(detail, /TelemetryCard/);
  assert.match(detail, /useGetAssignedTelemetryDeviceQuery/);
  assert.match(detail, /equipment_id: asset\.id \?\? assetId/);
  assert.match(page, /EmployeeAssetDetail/);
});
