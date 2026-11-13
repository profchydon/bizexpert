import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rfqCreateRequestCountry } from "./rfqCreateRequestCountry";
import type { CustomDeviceRequest } from "./types";

const baseRequest: CustomDeviceRequest = {
  rfqId: "rfq-1",
  id: "RFQ-1",
  devices: [],
  requestBudget: 0,
  country: "United States",
  status: "expired",
};

describe("rfqCreateRequestCountry", () => {
  it("returns country details when countryId is present", () => {
    assert.deepEqual(
      rfqCreateRequestCountry({
        ...baseRequest,
        countryId: "country-us",
        countryCode: "US",
      }),
      {
        id: "country-us",
        name: "United States",
        code: "US",
      },
    );
  });

  it("returns undefined when countryId is missing", () => {
    assert.equal(rfqCreateRequestCountry(baseRequest), undefined);
  });
});
