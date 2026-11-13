import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ISubOrder } from "@/types/orders";
import {
  buildVerifyOrderSuborders,
  getVerifiableAssetOrderIds,
  hasVerifiableAssetOrder,
} from "./verificationUtils";

const subOrder = (overrides: Partial<ISubOrder>): ISubOrder =>
  ({
    id: "sub-1",
    status: "verification_pending",
    ...overrides,
  }) as ISubOrder;

describe("getVerifiableAssetOrderIds (asset-based orders)", () => {
  it("returns unverified asset order ids", () => {
    const row = subOrder({
      assets: [
        { asset_order_id: "ao-1", verification_status: "verification_pending" },
        { asset_order_id: "ao-2", verification_status: "details_verified" },
      ] as any,
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), ["ao-1"]);
  });

  it("skips cancelled assets that still look pending", () => {
    const row = subOrder({
      assets: [
        {
          asset_order_id: "ao-live",
          status: "verification_pending",
          verification_status: "verification_pending",
        },
        {
          asset_order_id: "ao-cancelled",
          status: "order_cancelled",
          verification_status: "verification_pending",
        },
      ] as any,
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), ["ao-live"]);
    assert.deepEqual(buildVerifyOrderSuborders([row]), [
      { id: "ao-live", verification_contexts: ["delivery"] },
    ]);
  });

  it("returns nothing when every asset is verified", () => {
    const row = subOrder({
      assets: [
        { asset_order_id: "ao-1", verification_status: "details_verified" },
      ] as any,
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), []);
  });
});

describe("getVerifiableAssetOrderIds (off-boarding fallback)", () => {
  it("uses the sub-order id when there are no assets", () => {
    const row = subOrder({
      assets: [],
      verification_status: "verification_pending",
      equipment: { asset_order_id: "eq-ao-1" } as any,
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), ["sub-1"]);
    assert.equal(hasVerifiableAssetOrder(row), true);
  });

  it("skips a verified off-boarding sub-order", () => {
    const row = subOrder({
      assets: [],
      verification_status: "details_verified",
      equipment: { asset_order_id: "eq-ao-1" } as any,
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), []);
    assert.equal(hasVerifiableAssetOrder(row), false);
  });

  it("returns nothing when the sub-order has no id", () => {
    const row = subOrder({
      id: undefined as any,
      assets: [],
      equipment: {} as any,
    });
    assert.equal(hasVerifiableAssetOrder(row), false);
  });
});

describe("getVerifiableAssetOrderIds (context-aware reassign)", () => {
  it("returns the sub-order id when a context is still pending", () => {
    const row = subOrder({
      assets: [],
      type: "reassign",
      pending_contexts: ["pickup"],
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), ["sub-1"]);
    assert.equal(hasVerifiableAssetOrder(row), true);
  });

  it("returns nothing when no context is pending", () => {
    const row = subOrder({
      assets: [],
      type: "reassign",
      pending_contexts: [],
      pickup_verification_status: "details_verified",
      delivery_verification_status: "details_verified",
    });
    assert.deepEqual(getVerifiableAssetOrderIds([row]), []);
    assert.equal(hasVerifiableAssetOrder(row), false);
  });
});

describe("buildVerifyOrderSuborders", () => {
  it("defaults asset-based sub-orders to the delivery context", () => {
    const row = subOrder({
      assets: [
        { asset_order_id: "ao-1", verification_status: "verification_pending" },
      ] as any,
    });
    assert.deepEqual(buildVerifyOrderSuborders([row]), [
      { id: "ao-1", verification_contexts: ["delivery"] },
    ]);
  });

  it("uses the selected contexts for contextual sub-orders", () => {
    const row = subOrder({
      assets: [],
      type: "reassign",
      pending_contexts: ["pickup", "delivery"],
    });
    assert.deepEqual(buildVerifyOrderSuborders([row], ["pickup"]), [
      { id: "sub-1", verification_contexts: ["pickup"] },
    ]);
  });

  it("falls back to pending contexts when none are selected", () => {
    const row = subOrder({
      assets: [],
      type: "reassign",
      pending_contexts: ["pickup", "delivery"],
    });
    assert.deepEqual(buildVerifyOrderSuborders([row]), [
      { id: "sub-1", verification_contexts: ["pickup", "delivery"] },
    ]);
  });

  it("skips already-verified sub-orders and dedupes ids", () => {
    const verified = subOrder({
      id: "sub-9",
      assets: [],
      type: "reassign",
      pending_contexts: [],
      pickup_verification_status: "details_verified",
      delivery_verification_status: "details_verified",
    });
    const pending = subOrder({
      assets: [],
      type: "reassign",
      pending_contexts: ["pickup"],
    });
    assert.deepEqual(buildVerifyOrderSuborders([verified, pending]), [
      { id: "sub-1", verification_contexts: ["pickup"] },
    ]);
  });
});
