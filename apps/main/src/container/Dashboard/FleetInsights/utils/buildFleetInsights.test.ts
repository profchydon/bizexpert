import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { TelemetryDevice } from "@/types/telemetry";
import { buildFleetInsights, INSIGHT_LIMIT } from "./buildFleetInsights";

const device = (
  id: string,
  failCount: number,
  flags: Partial<TelemetryDevice["flags"]> = {},
): TelemetryDevice => ({
  equipment_id: id,
  device_id: id,
  title: id,
  serial_number: id,
  type: "Laptop",
  company_id: "entity-a",
  office_id: null,
  owner_type: "company",
  owner_id: null,
  assignee: null,
  agent: null,
  telemetry: {
    compliance_pass_count: Math.max(0, 4 - failCount),
    compliance_fail_count: failCount,
    compliance_results:
      failCount >= 2
        ? [
            { check_id: "disk_encryption", status: "fail" },
            { check_id: "firewall", status: "fail" },
          ]
        : [],
  },
  flags: {
    no_agent: false,
    revoked: false,
    reporting: true,
    stale: false,
    ...flags,
  },
});

test("buildFleetInsights surfaces multi-fail and caps at six", () => {
  const devices = [
    device("critical-1", 2),
    device("critical-2", 2),
    device("healthy", 0, { no_agent: true, reporting: false }),
  ];

  const insights = buildFleetInsights(devices);
  assert.ok(insights.some((insight) => insight.id === "multi-fail"));
  assert.ok(insights.some((insight) => insight.id === "no-agent"));
  assert.ok(insights.length <= INSIGHT_LIMIT);
});

test("insight show wiring passes device ids into list filter", () => {
  const list = readFileSync(
    "src/container/Dashboard/FleetInsights/components/FleetInsightsList.tsx",
    "utf8",
  );
  assert.match(list, /deviceIds: insight.deviceIds/);
});
