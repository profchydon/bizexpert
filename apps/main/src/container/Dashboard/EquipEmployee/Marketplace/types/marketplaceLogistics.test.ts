import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getMarketplaceLogisticsBannerTitle,
  shouldShowMarketplaceLogisticsBanner,
} from "./marketplaceLogistics";

describe("shouldShowMarketplaceLogisticsBanner", () => {
  it("returns true when logistics includes a summary", () => {
    assert.equal(
      shouldShowMarketplaceLogisticsBanner({
        summary:
          "Independence Day on 06/08/2026 is 3 days away. Expect potential closures.",
        holidays: [{ name: "Independence Day", date: "06/08/2026" }],
        active_alerts: [],
      }),
      true,
    );
  });

  it("returns false when summary is missing or blank", () => {
    assert.equal(shouldShowMarketplaceLogisticsBanner(undefined), false);
    assert.equal(shouldShowMarketplaceLogisticsBanner(null), false);
    assert.equal(
      shouldShowMarketplaceLogisticsBanner({ holidays: [], active_alerts: [] }),
      false,
    );
    assert.equal(
      shouldShowMarketplaceLogisticsBanner({ summary: "   " }),
      false,
    );
  });

  it("returns false for the no-disruptions empty-state summary", () => {
    assert.equal(
      shouldShowMarketplaceLogisticsBanner({
        summary: "No logistics disruptions or holidays in this period.",
        holidays: [],
        active_alerts: [],
      }),
      false,
    );
  });

  it("returns true when active alerts are present", () => {
    assert.equal(
      shouldShowMarketplaceLogisticsBanner({
        summary: "Severe weather may delay deliveries.",
        holidays: [],
        active_alerts: [{ type: "weather" }],
      }),
      true,
    );
  });
});

describe("getMarketplaceLogisticsBannerTitle", () => {
  it("builds a title from the first holiday", () => {
    assert.equal(
      getMarketplaceLogisticsBannerTitle({
        holidays: [{ name: "Independence Day", date: "06/08/2026" }],
      }),
      "Independence Day — 06/08/2026",
    );
  });

  it("returns null when no holiday name is available", () => {
    assert.equal(getMarketplaceLogisticsBannerTitle({ holidays: [] }), null);
    assert.equal(
      getMarketplaceLogisticsBannerTitle({
        holidays: [{ name: " ", date: "" }],
      }),
      null,
    );
  });
});
