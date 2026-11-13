import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  extractOrderIdFromResponse,
  resolveOrderSummaryFlow,
} from "./orderFlowAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";
import {
  trackEquipFlowStarted,
  trackItemSourceSelected,
  trackOrderCancelled,
  trackOrderSubmitted,
  trackOrderSummaryViewed,
} from "./orderFlowAnalytics";

describe("resolveOrderSummaryFlow", () => {
  it("prefers approval over other flags", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: true,
        isEquipEmployeeFlow: true,
        isStorageOnlyFlow: true,
      }),
      "approval",
    );
  });

  it("returns equip_employee when only that flag is set", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: false,
        isEquipEmployeeFlow: true,
        isStorageOnlyFlow: false,
      }),
      "equip_employee",
    );
  });

  it("returns buy_to_storage for storage-only flows", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: false,
        isEquipEmployeeFlow: false,
        isStorageOnlyFlow: true,
      }),
      "buy_to_storage",
    );
  });

  it("defaults to onboarding", () => {
    assert.equal(
      resolveOrderSummaryFlow({
        isApprovalFlow: false,
        isEquipEmployeeFlow: false,
        isStorageOnlyFlow: false,
      }),
      "onboarding",
    );
  });
});

describe("extractOrderIdFromResponse", () => {
  it("reads order_id from the response data", () => {
    assert.equal(
      extractOrderIdFromResponse({ data: { order_id: "order-1" } }),
      "order-1",
    );
  });

  it("falls back to data.id", () => {
    assert.equal(
      extractOrderIdFromResponse({ data: { id: "request-1" } }),
      "request-1",
    );
  });

  it("parses order_id from a payment link query string", () => {
    assert.equal(
      extractOrderIdFromResponse({
        data: { link: "https://checkout.example.com?order_id=order-99" },
      }),
      "order-99",
    );
  });

  it("uses the provided fallback when nothing is found", () => {
    assert.equal(
      extractOrderIdFromResponse({ data: {} }, "fallback"),
      "fallback",
    );
  });
});

describe("order flow analytics events", () => {
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

  it("tracks equip flow started with surface and employee count", () => {
    setAnalyticsClientForTests(mockClient());

    trackEquipFlowStarted("onboard_devices", 3);

    assert.equal(captured[0]?.event, "Equip Flow Started");
    assert.deepEqual(captured[0]?.properties, {
      surface: "onboard_devices",
      employee_count: 3,
    });
  });

  it("tracks item source selected with source and surface", () => {
    setAnalyticsClientForTests(mockClient());

    trackItemSourceSelected("storage", "equip_employee");

    assert.equal(captured[0]?.event, "Item Source Selected");
    assert.deepEqual(captured[0]?.properties, {
      source: "storage",
      surface: "equip_employee",
    });
  });

  it("tracks order summary viewed", () => {
    setAnalyticsClientForTests(mockClient());

    trackOrderSummaryViewed({
      order_flow: "onboarding",
      item_count: 2,
      total_value: 1500,
      currency: "GBP",
    });

    assert.equal(captured[0]?.event, "Order Summary Viewed");
    assert.deepEqual(captured[0]?.properties, {
      order_flow: "onboarding",
      item_count: 2,
      total_value: 1500,
      currency: "GBP",
    });
  });

  it("tracks order submitted with payment method", () => {
    setAnalyticsClientForTests(mockClient());

    trackOrderSubmitted({
      order_flow: "equip_employee",
      order_id: "order-1",
      item_count: 1,
      total_value: 500,
      payment_method: "Credit",
    });

    assert.equal(captured[0]?.event, "Order Submitted");
    assert.deepEqual(captured[0]?.properties, {
      order_flow: "equip_employee",
      order_id: "order-1",
      item_count: 1,
      total_value: 500,
      payment_method: "Credit",
    });
  });

  it("tracks order cancelled", () => {
    setAnalyticsClientForTests(mockClient());

    trackOrderCancelled({
      order_flow: "equip_employee",
      step_abandoned: "device_selection",
    });

    assert.equal(captured[0]?.event, "Order Cancelled");
    assert.deepEqual(captured[0]?.properties, {
      order_flow: "equip_employee",
      step_abandoned: "device_selection",
    });
  });
});
