import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  buildAboutPayload,
  buildCompanyDetailsPayload,
  buildHardwareCompliancePayload,
  buildItSetupPayload,
} from "./payloads";

test("about payload only sends the required api fields", () => {
  const payload = buildAboutPayload({
    employee_count: "51-200",
    work_setup: "hybrid",
    signup_persona: "founder",
    name: "ignored",
  });

  assert.deepEqual(payload, {
    employee_count: "51-200",
    work_setup: "hybrid",
    signup_persona: "founder",
  });
});

test("it setup payload maps the api fields including device count", () => {
  assert.deepEqual(
    buildItSetupPayload({
      it_support_structure: "dedicated_team",
      device_policy: "both",
      intended_mdm: "jamf",
      device_count: "27",
    }),
    {
      it_support_structure: "dedicated_team",
      device_policy: "both",
      intended_mdm: "jamf",
      device_count: 27,
    },
  );
});

test("hardware compliance payload keeps the selected requirements array", () => {
  assert.deepEqual(
    buildHardwareCompliancePayload({
      laptop_platform: "macbooks",
      compliance_requirements: ["soc2", "gdpr"],
    }),
    {
      laptop_platform: "macbooks",
      compliance_requirements: ["soc2", "gdpr"],
    },
  );
});

test("hardware compliance payload falls back to an empty requirements array", () => {
  assert.deepEqual(
    buildHardwareCompliancePayload({ laptop_platform: "windows" })
      .compliance_requirements,
    [],
  );
});

test("company details payload trims values and omits an empty trading name", () => {
  const payload = buildCompanyDetailsPayload({
    name: "  Acme Inc  ",
    trading_name: "   ",
    address: " 123 Main Street ",
    country: "Nigeria",
    billing_currency: "USD",
  });

  assert.deepEqual(payload, {
    name: "Acme Inc",
    address: "123 Main Street",
    country: "Nigeria",
    billing_currency: "USD",
  });
  assert.equal("trading_name" in payload, false);
});

test("company details payload includes a provided trading name", () => {
  const payload = buildCompanyDetailsPayload({
    name: "Acme Inc",
    trading_name: "Acme",
    address: "123 Main Street",
    country: "Nigeria",
    billing_currency: "USD",
  });

  assert.equal(payload.trading_name, "Acme");
});
