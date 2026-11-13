import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  STEP_0_QUESTIONS,
  STEP_1_QUESTIONS,
  STEP_2_QUESTIONS,
} from "./questionSteps";

const API_ENUMS: Record<string, string[]> = {
  employee_count: ["1-50", "51-200", "201-500", "500-1000", "1000+"],
  work_setup: ["single_office", "multi_office", "fully_remote", "hybrid"],
  signup_persona: ["it_admin", "hr_ops", "finance_ops", "founder"],
  it_support_structure: ["dedicated_team", "one_person", "ad_hoc"],
  device_policy: ["byod", "company_issued", "both"],
  intended_mdm: ["jamf", "intune", "kandji", "other", "none", "not_sure"],
  laptop_platform: ["macbooks", "windows", "both"],
  compliance_requirements: [
    "soc2",
    "iso27001",
    "hipaa",
    "gdpr",
    "cyber_essentials",
    "none",
    "exploring",
  ],
};

const ALL_QUESTIONS = [
  ...STEP_0_QUESTIONS,
  ...STEP_1_QUESTIONS,
  ...STEP_2_QUESTIONS,
];

test("every choice question key is an onboarding request field", () => {
  const keys = ALL_QUESTIONS.filter(
    (question) => question.kind !== "count",
  ).map((question) => question.key);
  assert.deepEqual(keys.sort(), Object.keys(API_ENUMS).sort());
});

test("it setup ends with a device count question", () => {
  const count = STEP_1_QUESTIONS.find((question) => question.kind === "count");
  assert.equal(count?.key, "device_count");
  assert.equal(
    count?.question,
    "How many devices do you plan to enrol on Rayda?",
  );
  assert.equal(STEP_1_QUESTIONS.at(-1)?.key, "device_count");
});

test("every option value matches the documented api enum", () => {
  ALL_QUESTIONS.filter((question) => question.kind !== "count").forEach(
    (question) => {
      const allowed = API_ENUMS[question.key];
      const values = question.options.map((option) => option.value);
      assert.deepEqual(
        values,
        allowed,
        `${question.key} options drifted from the api enum`,
      );
    },
  );
});

test("every option carries a human readable label", () => {
  ALL_QUESTIONS.forEach((question) => {
    question.options.forEach((option) => {
      assert.ok(option.label.trim().length > 0);
      assert.notEqual(option.label, option.value);
    });
  });
});

test("exclusive compliance options exist in the enum", () => {
  const compliance = STEP_2_QUESTIONS.find(
    (question) => question.key === "compliance_requirements",
  );
  assert.ok(compliance);
  assert.deepEqual(compliance.exclusiveOptions, ["none", "exploring"]);
  compliance.exclusiveOptions?.forEach((value) => {
    assert.ok(API_ENUMS.compliance_requirements.includes(value));
  });
});

test("only compliance requirements is multi select", () => {
  const multi = ALL_QUESTIONS.filter((question) => question.multiSelect);
  assert.deepEqual(
    multi.map((question) => question.key),
    ["compliance_requirements"],
  );
});
