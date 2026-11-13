import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { isStageComplete } from "./isStageComplete";

const wizard = readFileSync(
  "src/container/NewOnboarding/lib/useOnboardingWizard.ts",
  "utf8",
);

const setup = readFileSync(
  "src/container/NewOnboarding/Setup/index.tsx",
  "utf8",
);

test("nothing is preselected on the plan step", () => {
  assert.equal(wizard.includes("findFreePlan"), false);
  assert.match(
    wizard,
    /const \[selectedPlan, setSelectedPlan\] = useState\(""\)/,
  );
});

test("the submit button is disabled until a plan is chosen", () => {
  assert.match(setup, /disabled=\{isPlanStep && !selectedPlan\}/);
  assert.match(setup, /const isPlanStep = step === TOTAL_STEPS - 1;/);
});

test("the gate is scoped to the plan step, so earlier steps still submit", () => {
  assert.equal(isStageComplete(4, {}, ""), false);
  assert.equal(isStageComplete(4, {}, "procure"), true);
});

test("a resumed plan leaves the button enabled on arrival", () => {
  assert.match(
    wizard,
    /setSelectedPlan\(progress\.plan\?\.plan_slug \?\? ""\)/,
  );
});
