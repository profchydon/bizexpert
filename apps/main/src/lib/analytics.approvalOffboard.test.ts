import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  computeTimeToDecisionSeconds,
  extractPrimaryApprovalTier,
  trackApprovalQueued,
  trackApprovalReviewed,
  trackRfqQuoteActioned,
} from "./approvalAnalytics";
import {
  buildAssetTypeMix,
  buildDispositionMixFromActionTypes,
  buildDispositionMixFromLines,
  mapActionTypeToAnalytics,
  mapDispositionToAnalytics,
  trackDeviceDispositionSelected,
  trackOffboardingConfirmed,
  trackOffboardingFeeShown,
  trackOffboardingStarted,
} from "./offboardAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

describe("approval analytics helpers", () => {
  it("picks the highest-priority tier from approval items", () => {
    assert.equal(
      extractPrimaryApprovalTier([{ tier: "OPTIONAL" }, { tier: "REQUIRED" }]),
      "REQUIRED",
    );
  });

  it("computes time to decision from created_at", () => {
    const createdAt = new Date(Date.now() - 90_000).toISOString();
    const seconds = computeTimeToDecisionSeconds(createdAt);
    assert.ok(seconds != null && seconds >= 89 && seconds <= 91);
  });

  it("returns undefined when created_at is missing", () => {
    assert.equal(computeTimeToDecisionSeconds(undefined), undefined);
  });
});

describe("offboard analytics helpers", () => {
  it("maps enabled dispositions only", () => {
    assert.equal(mapDispositionToAnalytics("STORE"), "storage");
    assert.equal(mapDispositionToAnalytics("DISPOSE"), "archive");
    assert.equal(mapDispositionToAnalytics("REASSIGN"), null);
  });

  it("maps legacy action types for order summary mix", () => {
    assert.equal(mapActionTypeToAnalytics("Store"), "storage");
    assert.equal(mapActionTypeToAnalytics("Archive"), "archive");
    assert.equal(mapActionTypeToAnalytics("Sale"), "buy_to_storage");
    assert.equal(mapActionTypeToAnalytics("Transfer"), null);
  });

  it("builds disposition and asset type mixes", () => {
    assert.deepEqual(
      buildDispositionMixFromLines([
        { disposition: "STORE" },
        { disposition: "STORE" },
        { disposition: "DISPOSE" },
      ]),
      { storage: 2, archive: 1 },
    );
    assert.deepEqual(
      buildDispositionMixFromActionTypes(["Store", "Archive", "Sale"]),
      { storage: 1, archive: 1, buy_to_storage: 1 },
    );
    assert.deepEqual(
      buildAssetTypeMix(
        [{ assetType: "type-1" }, { assetType: "type-1" }],
        [{ id: "type-1", name: "Laptop/Workstation" }],
      ),
      { "Laptop/Workstation": 2 },
    );
  });
});

describe("approval and offboarding analytics events", () => {
  const captured: Array<{
    event: string;
    properties?: Record<string, unknown>;
  }> = [];

  const mockClient = () => ({
    identify: () => {},
    group: () => {},
    reset: () => {},
    capture: (event: string, properties?: object) =>
      captured.push({
        event,
        properties: properties as Record<string, unknown> | undefined,
      }),
    opt_out_capturing: () => {},
    opt_in_capturing: () => {},
    has_opted_out_capturing: () => false,
  });

  afterEach(() => {
    captured.length = 0;
    resetAnalyticsClientForTests();
  });

  it("tracks approval queued", () => {
    setAnalyticsClientForTests(mockClient());
    trackApprovalQueued({
      approval_id: "req-1",
      status: "AWAITING_APPROVAL",
      tier: "REQUIRED",
    });
    assert.equal(captured[0]?.event, "Approval Queued");
    assert.deepEqual(captured[0]?.properties, {
      approval_id: "req-1",
      status: "AWAITING_APPROVAL",
      tier: "REQUIRED",
    });
  });

  it("tracks approval reviewed with optional timing", () => {
    setAnalyticsClientForTests(mockClient());
    trackApprovalReviewed({
      approval_id: "req-1",
      decision: "approved",
      time_to_decision_s: 120,
    });
    assert.equal(captured[0]?.event, "Approval Reviewed");
    assert.deepEqual(captured[0]?.properties, {
      approval_id: "req-1",
      decision: "approved",
      time_to_decision_s: 120,
    });
  });

  it("tracks rfq quote actioned", () => {
    setAnalyticsClientForTests(mockClient());
    trackRfqQuoteActioned({
      approval_id: "req-1",
      decision: "declined",
    });
    assert.equal(captured[0]?.event, "RFQ Quote Actioned");
    assert.deepEqual(captured[0]?.properties, {
      approval_id: "req-1",
      decision: "declined",
    });
  });

  it("tracks offboarding lifecycle events", () => {
    setAnalyticsClientForTests(mockClient());

    trackOffboardingStarted("emp-1", 3);
    trackDeviceDispositionSelected("storage", "Phones");
    trackOffboardingFeeShown(250, { Phones: 2 });
    trackOffboardingConfirmed({
      order_id: "order-1",
      device_count: 2,
      disposition_mix: { storage: 2 },
      total_fee: 250,
    });

    assert.deepEqual(
      captured.map((entry) => entry.event),
      [
        "Offboarding Started",
        "Device Disposition Selected",
        "Offboarding Fee Shown",
        "Offboarding Confirmed",
      ],
    );
  });
});
