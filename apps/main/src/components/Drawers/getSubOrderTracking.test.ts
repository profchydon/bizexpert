import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSubOrderTracking } from "./getSubOrderTracking";

describe("getSubOrderTracking", () => {
  it("reads tracking fields from the sub-order", () => {
    const tracking = getSubOrderTracking({
      tracking_no: "OFF-EVQSE26",
      external_tracking_link: "https://track.dhl.com/123",
      courier_name: "DHL",
    } as never);

    assert.equal(tracking.trackingNo, "OFF-EVQSE26");
    assert.equal(tracking.externalTrackingLink, "https://track.dhl.com/123");
    assert.equal(tracking.courierName, "DHL");
  });

  it("prefers asset tracking number and ignores blank values", () => {
    const tracking = getSubOrderTracking(
      {
        tracking_no: "OFF-1",
        external_tracking_link: "  ",
        courier_name: null,
      } as never,
      { tracking_no: "TRK-1" },
    );

    assert.equal(tracking.trackingNo, "TRK-1");
    assert.equal(tracking.externalTrackingLink, "");
    assert.equal(tracking.courierName, "");
  });
});
