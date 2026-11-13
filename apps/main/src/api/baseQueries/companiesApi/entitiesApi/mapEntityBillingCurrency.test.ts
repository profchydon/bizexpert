import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapEntityBillingCurrency } from "./mapEntityBillingCurrency";
import type { EntityApiRecord } from "./types";

const baseEntity: EntityApiRecord = {
  id: "entity-1",
  name: "Intensa",
  email: "joeandy@yopmail.com",
  country: "United Kingdom",
  parent_company_id: null,
  is_primary: true,
  billing_currency: "GBP",
  billing_responsibility: "self",
  delegated_payer_id: null,
  lifecycle_status: "active",
  credit_state: "card_only",
  card_captured: false,
  permanent_card_only: false,
  billing_status_badge: "card_pending",
  credit_label: "card_only",
  credit_check: "pending",
  billing_arrangement: {
    mode: "self_billing",
    invoice_to: "this_entity",
    payment_method: "card_pending",
  },
  delegated_payer: null,
  offices_count: 1,
  created_at: "2025-01-07T14:28:41.000000Z",
  updated_at: "2026-03-17T10:16:11.000000Z",
};

describe("mapEntityBillingCurrency", () => {
  it("returns billing_currency when present", () => {
    assert.equal(mapEntityBillingCurrency(baseEntity), "GBP");
  });

  it("ignores the country currency when billing_currency is blank", () => {
    assert.equal(
      mapEntityBillingCurrency({
        ...baseEntity,
        billing_currency: "",
        country: {
          id: "nl-1",
          name: "Netherlands",
          code: "NL",
          currency_code: "EUR",
          currency_symbol: "€",
          payment_processor: "stripe",
        },
      }),
      "",
    );
  });

  it("uses delegated payer currency", () => {
    assert.equal(
      mapEntityBillingCurrency({
        ...baseEntity,
        billing_responsibility: "delegated",
        billing_currency: "USD",
        delegated_payer: {
          id: "payer-1",
          name: "Intensa",
          billing_currency: "GBP",
        },
      }),
      "GBP",
    );
  });
});
