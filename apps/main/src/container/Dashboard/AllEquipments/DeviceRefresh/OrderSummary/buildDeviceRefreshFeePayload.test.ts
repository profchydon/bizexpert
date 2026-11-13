import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDeviceRefreshFeePayload } from "./buildDeviceRefreshFeePayload";

describe("buildDeviceRefreshFeePayload", () => {
  it("keeps onboarding_from_storage instead of renaming it to onboarding", () => {
    const payload = buildDeviceRefreshFeePayload({
      companyId: "company-id",
      paymentMethod: "Credit",
      companyCountryId: "company-country-id",
      transformTogetFees: {
        offboarding: { service_type: "Offboarding" },
        onboarding_from_storage: { service_type: "Onboarding" },
      },
    });

    assert.deepEqual(payload, {
      companyId: "company-id",
      payment_method: "Credit",
      country_id: "company-country-id",
      offboarding: { service_type: "Offboarding" },
      onboarding_from_storage: { service_type: "Onboarding" },
    });
    assert.equal("onboarding" in payload, false);
    assert.equal("service_type" in payload, false);
  });
});
