import assert from "node:assert/strict";
import { test } from "node:test";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import {
  overviewCreditCopy,
  overviewCreditHasSpend,
  pickOverviewBillingEntity,
  resolveOverviewCreditEntity,
  resolveOverviewCreditView,
  shouldListOverviewEntities,
  shouldLoadOverviewEntityDetail,
} from "./overviewCreditStanding";

const entity = (
  overrides: Partial<EntityApiRecord> & Pick<EntityApiRecord, "id">,
): EntityApiRecord =>
  ({
    name: overrides.name ?? "Entity",
    email: "ops@example.com",
    country: "GB",
    parent_company_id: null,
    is_primary: false,
    billing_currency: "GBP",
    billing_responsibility: "self",
    delegated_payer_id: null,
    lifecycle_status: "active",
    credit_state: "card_only",
    card_captured: true,
    permanent_card_only: false,
    billing_status_badge: "operational",
    credit_label: "",
    credit_check: "",
    billing_arrangement: {
      mode: "self_billing",
      invoice_to: "",
      payment_method: "card",
    },
    delegated_payer: null,
    offices_count: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }) as EntityApiRecord;

test("only a global admin lists entities for overview credit standing", () => {
  assert.equal(shouldListOverviewEntities(true), true);
  assert.equal(shouldListOverviewEntities(false), false);
  assert.equal(shouldLoadOverviewEntityDetail(false, "entity-1"), true);
  assert.equal(shouldLoadOverviewEntityDetail(true, "entity-1"), false);
  assert.equal(shouldLoadOverviewEntityDetail(false, null), false);
});

test("entity admins use the workspace entity, not the entities list", () => {
  const primary = entity({ id: "primary", is_primary: true });
  const office = entity({ id: "office", name: "Office" });

  assert.equal(
    resolveOverviewCreditEntity(true, [primary, office], "office", null)?.id,
    "office",
  );
  assert.equal(
    resolveOverviewCreditEntity(false, [primary], "office", office)?.id,
    "office",
  );
  assert.equal(
    resolveOverviewCreditEntity(false, [primary], "office", null),
    null,
  );
});

test("pickOverviewBillingEntity prefers the active workspace entity", () => {
  const primary = entity({ id: "primary", is_primary: true });
  const office = entity({ id: "office", name: "Office" });

  assert.equal(
    pickOverviewBillingEntity([primary, office], "office")?.id,
    "office",
  );
  assert.equal(
    pickOverviewBillingEntity([primary, office], null)?.id,
    "primary",
  );
});

test("resolveOverviewCreditView maps API credit and suspended billing", () => {
  assert.equal(
    resolveOverviewCreditView(
      entity({ id: "a", credit_state: "active_credit" }),
    ),
    "active-credit",
  );
  assert.equal(
    resolveOverviewCreditView(
      entity({ id: "b", billing_status_badge: "suspended" }),
    ),
    "suspended",
  );
  assert.equal(resolveOverviewCreditView(null), null);
});

test("overviewCreditCopy hides extra context on live Net-30", () => {
  assert.equal(overviewCreditCopy("active-credit").showContext, false);
  assert.equal(overviewCreditCopy("card-only").showContext, true);
  assert.equal(overviewCreditCopy("suspended").label, "Suspended");
});

test("only an active Net-30 standing has credit spend on the Credit tab", () => {
  assert.equal(overviewCreditHasSpend("active-credit"), true);
  assert.equal(overviewCreditHasSpend("card-only"), false);
  assert.equal(overviewCreditHasSpend(null), false);
});
