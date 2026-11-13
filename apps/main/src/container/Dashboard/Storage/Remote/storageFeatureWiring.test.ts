import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("storage replaces the Fixture tool with live workspace and wipe data", () => {
  const page = read("src/container/Dashboard/Storage/Remote/StoragePage.tsx");
  const workspace = read(
    "src/container/Dashboard/Storage/Remote/hooks/useStorageWorkspace.ts",
  );
  const cartFlow = read(
    "src/container/Dashboard/Storage/Remote/hooks/useStoragePageCartFlow.ts",
  );
  const disposeModal = read(
    "src/container/Dashboard/Storage/Remote/components/dispose/DisposeDeviceModal.tsx",
  );
  const queue = read(
    "src/container/Dashboard/Storage/Remote/utils/queueStorageCartActions.ts",
  );

  assert.doesNotMatch(page, /FixtureTool/);
  assert.doesNotMatch(page, /useStorageFixtures/);
  assert.match(page, /useStorageWorkspace/);
  assert.match(workspace, /resolveStorageCustomerPlan/);
  assert.match(workspace, /openFleetImportDisabledReason/);
  assert.match(workspace, /company\?\.subscription\?\.plan/);
  assert.match(cartFlow, /toDisposeCartItem\(device, method\)/);
  assert.match(disposeModal, /isDeviceAlreadyErased\(device\)/);
  assert.match(queue, /isDeviceAlreadyErased\(device\)/);
});

test("storage keeps import, impact, and recommendations behind Coming soon", () => {
  const page = read("src/container/Dashboard/Storage/Remote/StoragePage.tsx");
  const header = read(
    "src/container/Dashboard/Storage/Remote/components/StoragePageHeader.tsx",
  );
  const recs = read(
    "src/container/Dashboard/Storage/Remote/components/recommendations/RecCollapsibleLayout.tsx",
  );

  assert.match(page, /comingSoon: true/);
  assert.match(page, /importDisabledReason=\{importDisabledReason\}/);
  assert.match(header, /reason=\{importDisabledReason\}/);
  assert.match(header, /Import devices/);
  assert.doesNotMatch(header, /onImport/);
  assert.match(recs, /Coming soon/);
  assert.match(recs, /Recommended for you/);
});
