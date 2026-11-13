import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("overview bodies keep the fleet health strip commented out", () => {
  const bodies = [
    read("src/container/Dashboard/Overview/GlobalOverviewBody.tsx"),
    read("src/container/Dashboard/Overview/EntityOverviewBody.tsx"),
    read("src/container/Dashboard/Overview/OfficeOverviewBody.tsx"),
  ];

  bodies.forEach((body) => {
    assert.match(body, /\/\/ import \{ FleetHealthStrip \}/);
    assert.match(body, /\{\/\* <FleetHealthStrip \/> \*\/\}/);
  });
});

test("fleet health strip uses the shared summary hook and fleet insights link", () => {
  const strip = read("src/container/Dashboard/Overview/FleetHealthStrip.tsx");

  assert.match(strip, /useFleetSummary/);
  assert.match(strip, /routes\.FLEET_INSIGHTS/);
  assert.match(strip, /useEntitlementOn\("telemetry_agent"\)/);
});
