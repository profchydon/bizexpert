import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapBillingStatusBadge,
  mapCreditState,
  mapEntityToSubsidiary,
} from "./mapEntityToSubsidiary";
import type { EntityApiRecord } from "./types";

const primaryEntity: EntityApiRecord = {
  id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
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

const delegatedEntity: EntityApiRecord = {
  id: "019feee6-53e4-72fc-9ba8-9737b6163b10",
  name: "Intensa Australia Pty",
  email: "intensa-au-1786419493032@mailinator.com",
  country: "Australia",
  parent_company_id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
  is_primary: false,
  billing_currency: "GBP",
  billing_responsibility: "delegated",
  delegated_payer_id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
  lifecycle_status: "active",
  credit_state: "card_only",
  card_captured: false,
  permanent_card_only: false,
  billing_status_badge: "delegated",
  credit_label: "card_only",
  credit_check: "pending",
  billing_arrangement: {
    mode: "delegated",
    invoice_to: "delegated_payer",
    payment_method: "delegated_payer_card",
  },
  delegated_payer: {
    id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
    name: "Intensa",
    billing_currency: "GBP",
  },
  offices_count: 0,
  created_at: "2026-08-11T03:38:20.000000Z",
  updated_at: "2026-08-11T03:38:20.000000Z",
};

describe("mapBillingStatusBadge", () => {
  it("maps card_pending and delegated badges", () => {
    assert.equal(
      mapBillingStatusBadge("card_pending", "active", false),
      "card-pending",
    );
    assert.equal(
      mapBillingStatusBadge("delegated", "active", false),
      "delegated",
    );
    assert.equal(
      mapBillingStatusBadge("unknown_badge", "active", false),
      "N/A",
    );
  });
});

describe("mapCreditState", () => {
  it("maps card_only to card-only", () => {
    assert.equal(mapCreditState("card_only"), "card-only");
  });
});

describe("mapEntityToSubsidiary", () => {
  it("maps a self-billed primary entity", () => {
    const mapped = mapEntityToSubsidiary(primaryEntity);

    assert.equal(mapped.name, "Intensa");
    assert.equal(mapped.region, "United Kingdom");
    assert.equal(mapped.currency, "GBP");
    assert.equal(mapped.status, "card-pending");
    assert.equal(mapped.billingMode, "self");
    assert.equal(mapped.billingEntityId, primaryEntity.id);
    assert.equal(mapped.officesCount, 1);
    assert.equal(mapped.isPrimary, true);
    assert.equal(mapped.cardOnFile, false);
    assert.equal(mapped.creditState, "card-only");
  });

  it("maps a delegated entity to its payer", () => {
    const mapped = mapEntityToSubsidiary(delegatedEntity);

    assert.equal(mapped.status, "delegated");
    assert.equal(mapped.billingMode, "delegated");
    assert.equal(mapped.billingEntityId, primaryEntity.id);
    assert.equal(mapped.billingEntityName, "Intensa");
    assert.equal(mapped.billingCurrency, "GBP");
  });

  it("maps country objects to region labels", () => {
    const mapped = mapEntityToSubsidiary({
      ...primaryEntity,
      country: {
        id: "gb-1",
        name: "United Kingdom",
        code: "GB",
        currency_code: "GBP",
        currency_symbol: "£",
        payment_processor: "stripe",
      },
    });

    assert.equal(mapped.region, "United Kingdom");
    assert.equal(mapped.currency, "GBP");
  });

  it("uses billing_status_badge as the status source of truth", () => {
    const mapped = mapEntityToSubsidiary({
      ...primaryEntity,
      billing_status_badge: "operational",
      card_captured: false,
      billing_arrangement: {
        mode: "self_billing",
        invoice_to: "this_entity",
        payment_method: "card_pending",
      },
    });

    assert.equal(mapped.status, "operational");
  });
});
