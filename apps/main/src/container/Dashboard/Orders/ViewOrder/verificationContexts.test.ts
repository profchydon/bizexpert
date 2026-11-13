import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ISubOrder } from "@/types/orders";
import {
  getSubOrderPendingContexts,
  getVerificationTargets,
  hasExplicitContextInfo,
} from "./verificationContexts";

const reassign = (overrides: Partial<ISubOrder> = {}): ISubOrder =>
  ({
    id: "sub-1",
    type: "reassign",
    status: "verification_pending",
    order_details: {
      from: {
        first_name: "Enyinne",
        last_name: "Emmanuel",
        address: "From St",
      },
      to: { first_name: "Iya", last_name: "Emmanuel", address: "To Ave" },
    },
    ...overrides,
  }) as ISubOrder;

describe("getSubOrderPendingContexts", () => {
  it("reads explicit pending_contexts", () => {
    const row = reassign({ pending_contexts: ["pickup", "delivery"] });
    assert.deepEqual(getSubOrderPendingContexts(row), ["pickup", "delivery"]);
  });

  it("ignores unknown context values", () => {
    const row = reassign({ pending_contexts: ["pickup", "bogus" as any] });
    assert.deepEqual(getSubOrderPendingContexts(row), ["pickup"]);
  });

  it("derives from per-context statuses when contexts absent", () => {
    const row = reassign({
      pickup_verification_status: "verification_pending",
      delivery_verification_status: "details_verified",
    });
    assert.deepEqual(getSubOrderPendingContexts(row), ["pickup"]);
  });

  it("returns empty when pending_contexts is an empty array", () => {
    const row = reassign({ pending_contexts: [] });
    assert.deepEqual(getSubOrderPendingContexts(row), []);
  });
});

describe("hasExplicitContextInfo", () => {
  it("is false for legacy sub-orders", () => {
    assert.equal(hasExplicitContextInfo(reassign()), false);
  });

  it("is true when status fields are present", () => {
    const row = reassign({ pickup_verification_status: "details_verified" });
    assert.equal(hasExplicitContextInfo(row), true);
  });
});

describe("getVerificationTargets", () => {
  it("builds a target per pending context with the right party", () => {
    const row = reassign({ pending_contexts: ["pickup", "delivery"] });
    const targets = getVerificationTargets(row);

    assert.deepEqual(
      targets.map((t) => t.context),
      ["pickup", "delivery"],
    );
    assert.equal(targets[0].name, "Enyinne Emmanuel");
    assert.equal(targets[0].address, "From St");
    assert.equal(targets[1].name, "Iya Emmanuel");
    assert.equal(targets[1].address, "To Ave");
    assert.equal(targets[0].hasExplicitContext, true);
  });

  it("marks each context pending or verified from its own status", () => {
    const row = reassign({
      pickup_verification_status: "verification_pending",
      delivery_verification_status: "details_verified",
    });
    const targets = getVerificationTargets(row);
    assert.equal(targets.length, 2);

    const pickup = targets.find((t) => t.context === "pickup");
    const delivery = targets.find((t) => t.context === "delivery");
    assert.equal(pickup?.isPending, true);
    assert.equal(delivery?.isPending, false);
    assert.equal(delivery?.name, "Iya Emmanuel");
    assert.equal(delivery?.address, "To Ave");
  });

  it("flips pending/verified when the statuses swap", () => {
    const row = reassign({
      pickup_verification_status: "details_verified",
      delivery_verification_status: "verification_pending",
    });
    const targets = getVerificationTargets(row);

    const pickup = targets.find((t) => t.context === "pickup");
    const delivery = targets.find((t) => t.context === "delivery");
    assert.equal(pickup?.isPending, false);
    assert.equal(delivery?.isPending, true);
  });

  it("falls back to a single delivery target for legacy sub-orders", () => {
    const row = {
      id: "sub-2",
      status: "verification_pending",
      employee_first_name: "Ada",
      employee_last_name: "Lovelace",
      address: "1 Analytical Way",
    } as ISubOrder;

    const targets = getVerificationTargets(row);
    assert.equal(targets.length, 1);
    assert.equal(targets[0].context, "delivery");
    assert.equal(targets[0].name, "Ada Lovelace");
    assert.equal(targets[0].hasExplicitContext, false);
  });
});
