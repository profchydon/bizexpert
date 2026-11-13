import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildOffboardingLegacyFeeRows } from "./offboardingLegacyFeeRows";

describe("buildOffboardingLegacyFeeRows", () => {
  it("formats non-zero fee lines and skips currency/total keys", () => {
    const rows = buildOffboardingLegacyFeeRows({
      fee_summary: {
        currency: { symbol: "$" },
        total_fee: 120,
        onboarding_fee: 50,
        service_fee: 0,
      },
    });

    assert.deepEqual(rows, [
      { key: "onboarding_fee", name: "Onboarding Fee", value: 50 },
    ]);
  });

  it("returns an empty list when fee data is missing", () => {
    assert.deepEqual(buildOffboardingLegacyFeeRows(undefined), []);
  });
});
