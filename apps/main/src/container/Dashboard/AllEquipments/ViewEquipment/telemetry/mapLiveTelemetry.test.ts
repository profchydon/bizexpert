import assert from "node:assert/strict";
import { test } from "node:test";
import type { TelemetryDevice } from "@/types/telemetry";
import { mapLiveTelemetry } from "./mapLiveTelemetry";
import { getDeviceHealth } from "./deviceHealth";
import { getComplianceHistory } from "./complianceHistory";

function device(overrides: Partial<TelemetryDevice> = {}): TelemetryDevice {
  return {
    equipment_id: "eq-1",
    device_id: "SN-1",
    title: "MacBook Pro",
    serial_number: "SN-1",
    type: "Laptop",
    company_id: "co-1",
    office_id: null,
    owner_type: null,
    owner_id: null,
    telemetry_ownership: "company",
    assignee: "user-1",
    agent: {
      id: "ag-1",
      status: "active",
      last_seen_at: new Date().toISOString(),
    },
    telemetry: {
      collected_at: new Date().toISOString(),
      os_name: "macOS",
      os_version: "15.5",
      agent_version: "2.4.1",
      disk_encrypted: true,
      memory_percent: 40,
      battery_percent: 80,
      battery_max_capacity_percent: 92,
      disk_total_bytes: 512 * 1024 ** 3,
      disk_free_bytes: 200 * 1024 ** 3,
      compliance_results: [
        { check_id: "disk_encryption", status: "pass" },
        { check_id: "firewall", status: "pass" },
        { check_id: "antivirus", status: "pass" },
        { check_id: "screen_lock", status: "pass" },
      ],
      os_update: { status: "up_to_date", pending_update_count: 0 },
    },
    flags: { no_agent: false, revoked: false, reporting: true, stale: false },
    ...overrides,
  };
}

test("mapLiveTelemetry maps a healthy company device without inventing software", () => {
  const telemetry = mapLiveTelemetry(device());
  assert.equal(telemetry?.agentInstalled, true);
  assert.equal(telemetry?.os.name, "macOS");
  assert.equal(telemetry?.compliance.encryption, "pass");
  assert.equal(telemetry?.software.length, 0);
  assert.equal(telemetry?.history.ready, false);
});

test("getDeviceHealth scores failing encryption as attention", () => {
  const telemetry = mapLiveTelemetry(
    device({
      telemetry: {
        ...device().telemetry,
        compliance_results: [
          { check_id: "disk_encryption", status: "fail" },
          { check_id: "firewall", status: "pass" },
          { check_id: "antivirus", status: "pass" },
          { check_id: "screen_lock", status: "pass" },
        ],
        os_update: { status: "up_to_date", pending_update_count: 0 },
      },
    }),
  );
  const health = getDeviceHealth(telemetry!);
  assert.equal(health.tone, "minor");
  assert.equal(health.score, 85);
});

test("employee-owned scoring ignores battery wear", () => {
  const telemetry = mapLiveTelemetry(
    device({
      telemetry: {
        ...device().telemetry,
        battery_max_capacity_percent: 50,
        disk_free_bytes: 5 * 1024 ** 3,
      },
    }),
  );
  const full = getDeviceHealth(telemetry!);
  const reduced = getDeviceHealth(telemetry!, true);
  assert.ok(full.score < reduced.score);
  assert.equal(reduced.hardwareIssues.length, 0);
});

test("compliance history stays last-report only without a live series", () => {
  const telemetry = mapLiveTelemetry(device());
  const history = getComplianceHistory("eq-1", telemetry!);
  assert.equal(history[0].days.length, 30);
  assert.ok(history[0].days.filter((day) => day !== "no_data").length <= 1);
});
