import { strict as assert } from "node:assert";
import { test } from "node:test";
import { isStageComplete } from "./isStageComplete";

test("question steps require every question answered", () => {
  assert.equal(isStageComplete(0, {}, ""), false);
  assert.equal(
    isStageComplete(
      0,
      {
        employee_count: "1-50",
        work_setup: "single_office",
        signup_persona: "it_admin",
      },
      "",
    ),
    true,
  );
});

test("it setup requires a device count from 1 to 100000", () => {
  const answers = {
    it_support_structure: "ad_hoc",
    device_policy: "both",
    intended_mdm: "none",
  };
  assert.equal(isStageComplete(1, answers, ""), false);
  assert.equal(
    isStageComplete(1, { ...answers, device_count: "0" }, ""),
    false,
  );
  assert.equal(
    isStageComplete(1, { ...answers, device_count: "100001" }, ""),
    false,
  );
  assert.equal(
    isStageComplete(1, { ...answers, device_count: "12" }, ""),
    true,
  );
});

test("laptop_platform is required on step 2 even for a byod device policy", () => {
  const byodAnswers = {
    device_policy: "byod",
    compliance_requirements: ["none"],
  };
  assert.equal(isStageComplete(2, byodAnswers, ""), false);
  assert.equal(
    isStageComplete(2, { ...byodAnswers, laptop_platform: "both" }, ""),
    true,
  );
});

test("step 2 requires at least one compliance requirement", () => {
  assert.equal(
    isStageComplete(
      2,
      { laptop_platform: "macbooks", compliance_requirements: [] },
      "",
    ),
    false,
  );
});

test("company details step requires name, address, country and billing currency", () => {
  assert.equal(isStageComplete(3, {}, ""), false);
  assert.equal(
    isStageComplete(
      3,
      {
        name: "Acme",
        address: "123 Main St",
        billing_currency: "USD",
      },
      "",
    ),
    false,
  );
  assert.equal(
    isStageComplete(
      3,
      {
        name: "  ",
        address: "123 Main St",
        country: "Nigeria",
        billing_currency: "USD",
      },
      "",
    ),
    false,
  );
  assert.equal(
    isStageComplete(
      3,
      {
        name: "Acme",
        address: "123 Main St",
        country: "Nigeria",
        billing_currency: "USD",
      },
      "",
    ),
    true,
  );
});

test("plan step requires a selected plan", () => {
  assert.equal(isStageComplete(4, {}, ""), false);
  assert.equal(isStageComplete(4, {}, "procure"), true);
});
