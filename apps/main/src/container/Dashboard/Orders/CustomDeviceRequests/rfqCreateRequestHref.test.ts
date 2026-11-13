import assert from "node:assert/strict";
import { describe, it } from "node:test";

import routes from "@/routes";
import { rfqCreateRequestHref } from "./rfqCreateRequestHref";
import type { CustomDeviceRequest } from "./types";

const baseRequest: CustomDeviceRequest = {
  rfqId: "rfq-1",
  id: "RFQ-1",
  devices: [],
  requestBudget: 0,
  country: "Nigeria",
  status: "expired",
};

describe("rfqCreateRequestHref", () => {
  it("builds a marketplace href that opens the create RFQ modal", () => {
    const href = rfqCreateRequestHref(baseRequest);

    assert.equal(href, `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?create_rfq=true`);
  });

  it("includes country query params when countryId is present", () => {
    const href = rfqCreateRequestHref({
      ...baseRequest,
      countryId: "country-ng",
      countryCode: "NG",
    });

    const url = new URL(href, "https://example.com");

    assert.equal(url.pathname, routes.EQUIP_EMPLOYEE_MARKETPLACE);
    assert.equal(url.searchParams.get("create_rfq"), "true");
    assert.equal(url.searchParams.get("country_id"), "country-ng");
    assert.equal(url.searchParams.get("country_name"), "Nigeria");
    assert.equal(url.searchParams.get("country_code"), "NG");
  });
});
