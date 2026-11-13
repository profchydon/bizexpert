import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("dashboard recent orders table uses nowrap v2 status and type badges", () => {
  const desktop = read(
    "src/components/OrderTable/DashboardOrdersTableColumn.tsx",
  );
  const mobile = read(
    "src/components/OrderTable/MobileDashboardOrdersTableColumn.tsx",
  );
  const statusBadge = read(
    "src/container/Dashboard/Orders/v2/components/OrderStatusBadgeV2.tsx",
  );
  const typeBadge = read(
    "src/container/Dashboard/Orders/v2/components/OrderTypeBadgeV2.tsx",
  );

  assert.match(desktop, /OrderStatusBadgeV2/);
  assert.match(desktop, /OrderTypeBadgeV2/);
  assert.doesNotMatch(desktop, /orderStatusMap/);
  assert.doesNotMatch(desktop, /orderFlowTypeCheck/);
  assert.match(mobile, /OrderStatusBadgeV2/);
  assert.doesNotMatch(mobile, /orderStatusMap/);
  assert.match(statusBadge, /whitespace-nowrap/);
  assert.match(typeBadge, /whitespace-nowrap/);
});
