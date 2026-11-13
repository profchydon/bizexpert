import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { join } from "node:path";

import { trackSubOrderCancelRequested } from "./subOrderCancelAnalytics";
import {
  resetAnalyticsClientForTests,
  setAnalyticsClientForTests,
} from "./analytics";

afterEach(() => {
  resetAnalyticsClientForTests();
});

describe("sub-order cancel analytics", () => {
  it("tracks opened and submitted with order ids", () => {
    const captured: Array<{
      event: string;
      properties?: Record<string, unknown>;
    }> = [];
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

    trackSubOrderCancelRequested({
      status: "opened",
      order_id: "ord-1",
      sub_order_id: "sub-1",
    });
    trackSubOrderCancelRequested({ status: "submitted", order_id: "ord-1" });

    assert.equal(captured[0]?.event, "Sub-Order Cancel Requested");
    assert.deepEqual(captured[0]?.properties, {
      status: "opened",
      order_id: "ord-1",
      sub_order_id: "sub-1",
    });
    assert.deepEqual(captured[1]?.properties, {
      status: "submitted",
      order_id: "ord-1",
    });
  });

  it("is wired on modal open and confirm", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/SubOrderCancelModal.tsx",
      ),
      "utf8",
    );
    assert.match(source, /status: "opened"/);
    assert.match(source, /status: "submitted"/);
    assert.doesNotMatch(source, /Order Cancelled/);
  });
});
