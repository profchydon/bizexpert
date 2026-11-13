import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { aliasOrderStatus } from "./orderStatusBadgeKey";

describe("aliasOrderStatus", () => {
  it("renders a cancelled device as cancelled", () => {
    assert.equal(aliasOrderStatus("order_cancelled"), "cancelled");
    assert.equal(aliasOrderStatus("ORDER_CANCELLED"), "cancelled");
  });

  it("renders a delivered device as completed", () => {
    assert.equal(aliasOrderStatus("order_delivered"), "completed");
    assert.equal(aliasOrderStatus("DELIVERED"), "completed");
    assert.equal(aliasOrderStatus("picked_up"), "completed");
  });

  it("leaves known statuses unchanged", () => {
    assert.equal(
      aliasOrderStatus("verification_pending"),
      "verification_pending",
    );
    assert.equal(aliasOrderStatus("cancelled"), "cancelled");
    assert.equal(aliasOrderStatus(null), null);
  });
});
