import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("classify discovered device posts ownership in the encrypted body", () => {
  const source = readFileSync(
    "src/api/baseQueries/companiesApi/telemetryApi/telemetryMutations.ts",
    "utf8",
  );

  assert.match(source, /classifyDiscoveredDevice:/);
  assert.match(source, /data: \{ ownership \}/);
  assert.doesNotMatch(
    source,
    /discovered\/\$\{agentId\}\/classify[\s\S]{0,120}excludePathFromEncryption/,
  );
});
