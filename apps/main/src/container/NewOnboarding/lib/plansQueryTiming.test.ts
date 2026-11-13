import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { TOTAL_STEPS } from "../data/stepMeta";

const wizard = readFileSync(
  "src/container/NewOnboarding/lib/useOnboardingWizard.ts",
  "utf8",
);
const setup = readFileSync(
  "src/container/NewOnboarding/Setup/index.tsx",
  "utf8",
);
const panels = readFileSync(
  "src/container/NewOnboarding/Setup/SetupStepPanels.tsx",
  "utf8",
);

test("plans are not fetched until the wizard reaches the plan step", () => {
  assert.match(
    wizard,
    /usePlansQuery\(undefined, \{\s*skip: step !== PLAN_STEP,/,
  );
});

test("returning to the plan step refetches instead of serving cached plans", () => {
  assert.match(
    wizard,
    /skip: step !== PLAN_STEP,\s*refetchOnMountOrArgChange: true,/,
  );
});

test("the plan step constant tracks the last step, not a loose number", () => {
  assert.match(wizard, /const PLAN_STEP = TOTAL_STEPS - 1;/);
  assert.equal(TOTAL_STEPS - 1, 4);
});

test("the plan step is the only place the plan selection renders", () => {
  assert.match(panels, /\{step === 4 && \(\s*<PlanSelectionStep/);
  assert.doesNotMatch(setup, /<PlanSelectionStep/);
});

test("a skipped or refetching query shows the loader, not stale plans", () => {
  assert.match(
    setup,
    /plansQuery\.isFetching \|\| plansQuery\.isUninitialized/,
  );
});

test("progress is still fetched up front, since every step prefills from it", () => {
  assert.match(
    wizard,
    /useGetOnboardingProgressQuery\(\s*\{ companyId \},\s*\{ skip: !companyId \},?\s*\)/,
  );
});
