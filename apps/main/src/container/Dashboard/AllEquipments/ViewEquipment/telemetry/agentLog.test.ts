import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getAgentLog } from "./agentLog";
import type { CheckHistory } from "./complianceHistory";
import { CHECK_EVENT } from "./signalCopy";
import type { AgentTelemetry } from "./types";

test("compliance history types check keys from signal copy", () => {
  const source = readFileSync(
    "src/container/Dashboard/AllEquipments/ViewEquipment/telemetry/complianceHistory.ts",
    "utf8",
  );
  assert.match(source, /CHECK_ORDER, type CheckKey/);
});

test("agent log looks up check event copy by history key", () => {
  const telemetry = {
    daysSinceSync: 0,
    isStale: false,
    agentVersion: "2.4.1",
    storage: { totalGb: 512, freeGb: 200 },
    battery: { maxCapacityPct: 92 },
  } as AgentTelemetry;
  const history: CheckHistory[] = [
    {
      key: "encryption",
      days: [],
      current: "fail",
      changedDaysAgo: 3,
    },
  ];
  const log = getAgentLog("eq-1", telemetry, history);
  assert.ok(log.some((event) => event.text === CHECK_EVENT.encryption));
});
