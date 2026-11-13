import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { applyFleetListFilter, filterLabel } from "./utils/fleetFilters";
import type { TelemetryDevice } from "@/types/telemetry";

const sampleDevice = (
  id: string,
  overrides: Partial<TelemetryDevice> = {},
): TelemetryDevice => ({
  equipment_id: id,
  device_id: id,
  title: `Device ${id}`,
  serial_number: id,
  type: "Laptop",
  company_id: "company-1",
  office_id: null,
  owner_type: "company",
  owner_id: null,
  assignee: null,
  agent: null,
  telemetry: {
    compliance_pass_count: 3,
    compliance_fail_count: 0,
    compliance_results: [],
  },
  flags: {
    no_agent: false,
    revoked: false,
    reporting: true,
    stale: false,
  },
  ...overrides,
});

test("stat tile filter narrows the attention table set", () => {
  const devices = [
    sampleDevice("a"),
    sampleDevice("b", {
      flags: {
        no_agent: true,
        revoked: false,
        reporting: false,
        stale: false,
      },
    }),
  ];

  const filtered = applyFleetListFilter(devices, {
    kind: "tile",
    tile: "no_agent",
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.equipment_id, "b");
  assert.equal(applyFleetListFilter(devices, null).length, devices.length);
});

test("filter banner copy includes count and clear control exists in page wiring", () => {
  const filter = { kind: "tile" as const, tile: "critical" as const };
  assert.match(filterLabel(filter, 4), /Critical devices, 4 devices/);

  const page = readFileSync(
    "src/container/Dashboard/FleetInsights/index.tsx",
    "utf8",
  );
  const banner = readFileSync(
    "src/container/Dashboard/FleetInsights/components/FleetFilterBanner.tsx",
    "utf8",
  );

  assert.match(page, /FleetFilterBanner/);
  assert.match(page, /setActiveFilter\(null\)/);
  assert.match(banner, /Clear filter/);
});
