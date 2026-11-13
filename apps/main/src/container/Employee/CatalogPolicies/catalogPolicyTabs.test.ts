import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogPolicyDetailTabFromParam,
  catalogPolicyDetailTabs,
} from "./catalogPolicyTabs";

describe("employee catalog policy detail tabs", () => {
  it("opens the order request tab from the query param", () => {
    assert.equal(
      catalogPolicyDetailTabFromParam("order-requests"),
      catalogPolicyDetailTabs.orderRequests,
    );
  });

  it("defaults unknown or missing query params to the catalog tab", () => {
    assert.equal(
      catalogPolicyDetailTabFromParam(null),
      catalogPolicyDetailTabs.catalog,
    );
    assert.equal(
      catalogPolicyDetailTabFromParam("orders"),
      catalogPolicyDetailTabs.catalog,
    );
  });
});
