import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Settings/Subscription/PlanUpgradePrompt.tsx",
  "utf8",
);

describe("PlanUpgradePrompt", () => {
  it("shows a loading state while opening subscription", () => {
    assert.match(source, /useTransitionRouter/);
    assert.match(source, /isLoading=\{isPending\}/);
    assert.match(source, /push\(routes\.SETTINGS_SUBSCRIPTION\)/);
  });
});
