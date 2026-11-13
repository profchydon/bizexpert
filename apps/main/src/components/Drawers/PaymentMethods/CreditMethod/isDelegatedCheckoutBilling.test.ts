import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  DELEGATED_WALLET_NOTE,
  MASKED_WALLET_AMOUNT,
  hasBillingSignal,
  isDelegatedBillingSource,
  resolveDelegatedBilling,
} from "./isDelegatedCheckoutBilling";

const hookSource = readFileSync(
  join(
    process.cwd(),
    "src/components/Drawers/PaymentMethods/CreditMethod/useCheckoutDelegatedBilling.ts",
  ),
  "utf8",
);

describe("isDelegatedBillingSource", () => {
  it("treats responsibility, badge, or arrangement mode as delegated", () => {
    assert.equal(
      isDelegatedBillingSource({ billing_responsibility: "delegated" }),
      true,
    );
    assert.equal(
      isDelegatedBillingSource({ billing_status_badge: "delegated" }),
      true,
    );
    assert.equal(
      isDelegatedBillingSource({
        billing_arrangement: { mode: "delegated" },
      }),
      true,
    );
  });

  it("does not treat self-billing or card-only as delegated", () => {
    assert.equal(
      isDelegatedBillingSource({ billing_responsibility: "self" }),
      false,
    );
    assert.equal(
      isDelegatedBillingSource({ billing_status_badge: "card_only" }),
      false,
    );
    assert.equal(
      isDelegatedBillingSource({
        billing_arrangement: { mode: "self_billing" },
      }),
      false,
    );
    assert.equal(isDelegatedBillingSource(null), false);
  });
});

describe("hasBillingSignal", () => {
  it("is true when any billing field is present", () => {
    assert.equal(
      hasBillingSignal({ billing_status_badge: "operational" }),
      true,
    );
    assert.equal(hasBillingSignal({}), false);
    assert.equal(hasBillingSignal(undefined), false);
  });
});

describe("resolveDelegatedBilling", () => {
  it("resolves delegated from membership without waiting for the entity query", () => {
    assert.deepEqual(
      resolveDelegatedBilling({
        membership: { billing_status_badge: "delegated" },
        entity: undefined,
        entityLoading: true,
      }),
      { isDelegated: true, isResolving: false },
    );
  });

  it("keeps self-billing off the delegated path even while entity is loading", () => {
    assert.deepEqual(
      resolveDelegatedBilling({
        membership: { billing_arrangement: { mode: "self_billing" } },
        entity: undefined,
        entityLoading: true,
      }),
      { isDelegated: false, isResolving: false },
    );
  });

  it("waits only when no billing signal exists yet", () => {
    assert.deepEqual(
      resolveDelegatedBilling({
        membership: undefined,
        entity: undefined,
        entityLoading: true,
      }),
      { isDelegated: false, isResolving: true },
    );
  });

  it("uses the entity record when membership has no billing fields", () => {
    assert.deepEqual(
      resolveDelegatedBilling({
        membership: { billing_status_badge: null },
        entity: { billing_responsibility: "delegated" },
        entityLoading: false,
      }),
      { isDelegated: true, isResolving: false },
    );
  });
});

describe("delegated wallet copy", () => {
  it("masks with a fixed string and never names a parent amount", () => {
    assert.equal(MASKED_WALLET_AMOUNT, "••••••");
    assert.equal(
      DELEGATED_WALLET_NOTE,
      "This order is billed to another entity.",
    );
    assert.doesNotMatch(MASKED_WALLET_AMOUNT, /\d/);
  });
});

describe("useCheckoutDelegatedBilling", () => {
  it("reads the active entity, not the parent auth company", () => {
    assert.match(hookSource, /useActiveWorkspace/);
    assert.match(hookSource, /useGetEntityQuery/);
    assert.match(hookSource, /getEntityMemberships/);
    assert.doesNotMatch(hookSource, /getCompanyDetails/);
    assert.doesNotMatch(hookSource, /useGetWalletQuery/);
  });
});
