import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Accounts/components/SubsidiaryPlanModal.tsx",
  "utf8",
);

test("upgrade to scale opens subscription settings with a loading state", () => {
  assert.match(source, /useTransitionRouter/);
  assert.match(source, /push\(routes\.SETTINGS_SUBSCRIPTION\)/);
  assert.match(source, /isLoading=\{isPending\}/);
  assert.match(source, /Upgrade to Scale/);
  assert.match(source, /disabled=\{isPending\}/);
});
