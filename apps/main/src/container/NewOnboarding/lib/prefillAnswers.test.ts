import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { IOnboardingProgress } from "@/types/onboarding";
import { prefillAnswers, resumeStepFrom } from "./prefillAnswers";

const progress: IOnboardingProgress = {
  step: 3,
  completed_steps: [1, 2, 3],
  onboarding_completed: false,
  agreement_signed: false,
  is_primary: true,
  about: {
    employee_count: "51-200",
    work_setup: "hybrid",
    signup_persona: "founder",
    industry: null,
  },
  it_setup: {
    it_support_structure: "one_person",
    device_policy: "byod",
    intended_mdm: "not_sure",
    device_count: 27,
  },
  hardware_compliance: {
    laptop_platform: "both",
    compliance_requirements: ["soc2", "iso27001"],
  },
  company_details: {
    name: "Acme Inc",
    trading_name: null,
    address: "123 Main Street",
    city: null,
    state: null,
    country: "Nigeria",
    billing_currency: "USD",
    industry: null,
  },
  plan: { plan_slug: null },
};

test("prefill maps saved progress onto answer keys", () => {
  const answers = prefillAnswers(progress);

  assert.equal(answers.employee_count, "51-200");
  assert.equal(answers.work_setup, "hybrid");
  assert.equal(answers.signup_persona, "founder");
  assert.equal(answers.it_support_structure, "one_person");
  assert.equal(answers.device_policy, "byod");
  assert.equal(answers.intended_mdm, "not_sure");
  assert.equal(answers.device_count, "27");
  assert.equal(answers.laptop_platform, "both");
  assert.deepEqual(answers.compliance_requirements, ["soc2", "iso27001"]);
  assert.equal(answers.name, "Acme Inc");
  assert.equal(answers.address, "123 Main Street");
  assert.equal(answers.country, "Nigeria");
  assert.equal(answers.billing_currency, "USD");
});

test("prefill omits null fields instead of writing empty strings", () => {
  const answers = prefillAnswers(progress);
  assert.equal("trading_name" in answers, false);
});

test("prefill drops a device count of zero", () => {
  const answers = prefillAnswers({
    ...progress,
    it_setup: { ...progress.it_setup, device_count: 0 },
  });
  assert.equal("device_count" in answers, false);
});

test("prefill returns an empty object without progress", () => {
  assert.deepEqual(prefillAnswers(undefined), {});
});

test("prefill copies the compliance array rather than sharing it", () => {
  const answers = prefillAnswers(progress);
  (answers.compliance_requirements as string[]).push("gdpr");
  assert.deepEqual(progress.hardware_compliance.compliance_requirements, [
    "soc2",
    "iso27001",
  ]);
});

test("compliance selections survive the server returning them reordered", () => {
  const reordered = prefillAnswers({
    ...progress,
    hardware_compliance: {
      laptop_platform: "both",
      compliance_requirements: ["iso27001", "soc2"],
    },
  });

  const selected = reordered.compliance_requirements as string[];
  assert.equal(selected.includes("soc2"), true);
  assert.equal(selected.includes("iso27001"), true);
});

const at = (completed_steps: number[], step = 0) => ({
  ...progress,
  step,
  completed_steps,
});

test("a brand new account starts on the first step, never further in", () => {
  assert.equal(resumeStepFrom(undefined), 0);
  assert.equal(resumeStepFrom(at([])), 0);
});

test("resume lands on the first step that is not yet completed", () => {
  assert.equal(resumeStepFrom(at([1])), 1);
  assert.equal(resumeStepFrom(at([1, 2])), 2);
  assert.equal(resumeStepFrom(at([1, 2, 3])), 3);
  assert.equal(resumeStepFrom(at([1, 2, 3, 4])), 4);
  assert.equal(resumeStepFrom(at([1, 2, 3, 4, 5])), 4);
});

test("completed_steps wins over an out of range step field", () => {
  assert.equal(resumeStepFrom(at([], 5)), 0);
  assert.equal(resumeStepFrom(at([], 99)), 0);
  assert.equal(resumeStepFrom(at([1, 2], -1)), 2);
});

test("a gap in completed_steps resumes at the gap, not past it", () => {
  assert.equal(resumeStepFrom(at([1, 3, 4])), 1);
  assert.equal(resumeStepFrom(at([2, 3])), 0);
});

test("a missing completed_steps array does not skip the user ahead", () => {
  assert.equal(
    resumeStepFrom({
      ...progress,
      step: 4,
      completed_steps: undefined as never,
    }),
    0,
  );
});
