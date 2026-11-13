import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { billingEntityDisplay } from "./billingEntityDisplay";

const entity = {
  name: "Intensa United Kingdom 7",
  billing_currency: "USD",
  billing_responsibility: "self",
  delegated_payer: null,
} as EntityApiRecord;

describe("billingEntityDisplay", () => {
  it("uses the entity name and billing currency when it bills itself", () => {
    assert.deepEqual(billingEntityDisplay({ entity }), {
      name: "Intensa United Kingdom 7",
      currencyCode: "USD",
    });
  });

  it("uses the delegated payer name and currency", () => {
    assert.deepEqual(
      billingEntityDisplay({
        entity: {
          ...entity,
          billing_responsibility: "delegated",
          delegated_payer: {
            id: "payer-1",
            name: "Intensa United Kingdom 5",
            billing_currency: "USD",
          },
        },
      }),
      { name: "Intensa United Kingdom 5", currencyCode: "USD" },
    );
  });

  it("uses the signed-in company when no entity workspace is selected", () => {
    assert.deepEqual(
      billingEntityDisplay({
        company: { name: "Intensa", billing_currency: "GBP" },
      }),
      { name: "Intensa", currencyCode: "GBP" },
    );
  });
});
