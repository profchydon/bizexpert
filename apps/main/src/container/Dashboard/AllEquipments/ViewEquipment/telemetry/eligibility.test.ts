import assert from "node:assert/strict";
import { test } from "node:test";
import { telemetryEligible } from "./eligibility";

test("telemetryEligible includes tablets and laptops", () => {
  assert.equal(telemetryEligible("Laptop/Workstation"), true);
  assert.equal(telemetryEligible("Tablet"), true);
  assert.equal(telemetryEligible("Phone"), true);
  assert.equal(telemetryEligible("Desktop"), true);
});

test("telemetryEligible excludes accessories and empty types", () => {
  assert.equal(telemetryEligible("Accessories"), false);
  assert.equal(telemetryEligible("Office"), false);
  assert.equal(telemetryEligible(""), false);
  assert.equal(telemetryEligible(undefined), false);
});
