import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  trackActivationStage,
  trackCompanyProfileCompleted,
  trackFirstCountrySelected,
  trackOnboardingCompleted,
  trackSignupStarted,
} from "./activationAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";
import {
  trackDeliveryVerified,
  trackEmployeeAssetViewed,
  trackEmployeeCatalogViewed,
  trackEmployeeOrderSubmitted,
  trackTrackPageViewed,
} from "./employeePortalAnalytics";

type CapturedEvent = { event: string; properties?: Record<string, unknown> };

function createCaptureRecorder() {
  const captured: CapturedEvent[] = [];
  setAnalyticsClientForTests({
    identify: () => {},
    group: () => {},
    reset: () => {},
    capture: (event, properties) => {
      captured.push({
        event,
        properties: properties as Record<string, unknown>,
      });
    },
    opt_out_capturing: () => {},
    opt_in_capturing: () => {},
    has_opted_out_capturing: () => false,
  });
  return captured;
}

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("activation analytics", () => {
  it("emits signup started without properties", () => {
    const captured = createCaptureRecorder();
    trackSignupStarted();
    assert.equal(captured[0]?.event, "Signup Started");
    assert.equal(captured[0]?.properties, undefined);
  });

  it("routes stage transitions to the matching activation event", () => {
    const captured = createCaptureRecorder();
    trackActivationStage("Verification");
    trackActivationStage("Onboarding");
    trackActivationStage("Company Information");
    trackActivationStage("Completed");
    assert.deepEqual(
      captured.map((entry) => entry.event),
      [
        "Signup Started",
        "Signup Started",
        "Company Profile Completed",
        "Onboarding Completed",
      ],
    );
  });

  it("emits first country selected without properties", () => {
    const captured = createCaptureRecorder();
    trackFirstCountrySelected();
    assert.equal(captured[0]?.event, "First Country Selected");
    assert.equal(captured[0]?.properties, undefined);
  });

  it("emits company profile completed and onboarding completed helpers", () => {
    const captured = createCaptureRecorder();
    trackCompanyProfileCompleted();
    trackOnboardingCompleted();
    assert.deepEqual(
      captured.map((entry) => entry.event),
      ["Company Profile Completed", "Onboarding Completed"],
    );
  });
});

describe("employee portal analytics", () => {
  it("emits employee catalog viewed without properties", () => {
    const captured = createCaptureRecorder();
    trackEmployeeCatalogViewed();
    assert.equal(captured[0]?.event, "Employee Catalog Viewed");
    assert.equal(captured[0]?.properties, undefined);
  });

  it("emits employee order submitted with overlapping order fields", () => {
    const captured = createCaptureRecorder();
    trackEmployeeOrderSubmitted({
      order_id: "ord_1",
      item_count: 2,
      total_value: 1500,
    });
    assert.equal(captured[0]?.event, "Employee Order Submitted");
    assert.deepEqual(captured[0]?.properties, {
      order_id: "ord_1",
      item_count: 2,
      total_value: 1500,
    });
  });

  it("emits track page viewed with order_id", () => {
    const captured = createCaptureRecorder();
    trackTrackPageViewed({ order_id: "ORD-42" });
    assert.equal(captured[0]?.event, "Track Page Viewed");
    assert.deepEqual(captured[0]?.properties, { order_id: "ORD-42" });
  });

  it("emits delivery verified and asset viewed without properties", () => {
    const captured = createCaptureRecorder();
    trackDeliveryVerified();
    trackEmployeeAssetViewed();
    assert.deepEqual(
      captured.map((entry) => entry.event),
      ["Delivery Verified", "Employee Asset Viewed"],
    );
  });

  it("capture works before identify is called", () => {
    const captured = createCaptureRecorder();
    trackTrackPageViewed({ order_id: "anon-order" });
    assert.equal(captured.length, 1);
    assert.equal(captured[0]?.event, "Track Page Viewed");
  });
});
