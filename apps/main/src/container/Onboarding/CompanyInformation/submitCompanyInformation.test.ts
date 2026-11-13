import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCompanyInformationPayload,
  submitCompanyInformation,
} from "./submitCompanyInformation";

describe("submitCompanyInformation", () => {
  it("maps a company draft with null size and a country label", () => {
    const payload = buildCompanyInformationPayload(
      { name: "Acme", email: "ops@acme.com", size: null },
      { country: "country-1", address: "1 High St" },
      "United Kingdom",
      { state: "England", lat: 51.5, lng: -0.1, currencyCode: "GBP" },
    );

    assert.equal(payload.size, null);
    assert.equal(payload.country, "United Kingdom");
    assert.equal(payload.address, "1 High St");
    assert.equal(payload.billing_currency, "USD");
  });

  it("forwards the payload to updateCompany", async () => {
    const payload = buildCompanyInformationPayload(
      { name: "Acme", email: "ops@acme.com", size: "11-50" },
      { country: "country-1", address: "1 High St" },
      "United Kingdom",
    );
    let received: unknown;
    const updateCompany = (request: unknown) => {
      received = request;
      return { unwrap: async () => undefined };
    };

    await submitCompanyInformation({
      updateCompany,
      companyId: "co-1",
      payload,
      onContinue: () => undefined,
    });

    assert.deepEqual(received, { companyId: "co-1", company: payload });
  });
});
