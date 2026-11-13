import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACTIVE_ORDER_STATUSES,
  ACTIVE_ORDER_STATUS_QUERY,
  buildInStorageOrdersParams,
  mapMovementToApiDirection,
} from "./buildInStorageOrdersParams";
import { ORDERS_API_MAX_PAGE_SIZE } from "../constants/ordersTabConstants";
import {
  isActiveApiOrderStatus,
  mapApiOrderDirection,
  mapApiOrderStatus,
} from "./mapInStorageOrder";

describe("storage order API helpers", () => {
  it("maps status and direction values", () => {
    assert.equal(mapApiOrderStatus("awaiting_response"), "action_required");
    assert.equal(mapApiOrderStatus("completed"), "completed");
    assert.equal(mapApiOrderDirection("out_of_storage"), "outbound");
    assert.equal(mapApiOrderDirection("into_storage"), "inbound");
    assert.equal(mapApiOrderDirection("in_storage"), "service");
    assert.equal(mapApiOrderDirection(null), undefined);
    assert.equal(isActiveApiOrderStatus("in_progress"), true);
    assert.equal(isActiveApiOrderStatus("completed"), false);
  });

  it("builds list params for active and completed tabs", () => {
    const active = buildInStorageOrdersParams({
      statusTab: "active",
      movement: "inbound",
      page: 2,
      pageSize: 15,
    });

    assert.equal(active.search, undefined);
    assert.equal(active.direction, "into_storage");
    assert.equal(active.status, ACTIVE_ORDER_STATUS_QUERY);
    assert.equal(active.page, 2);
    assert.equal(active.per_page, 15);

    const completed = buildInStorageOrdersParams({
      statusTab: "completed",
      movement: "all",
      page: 1,
      pageSize: 25,
    });

    assert.equal(completed.status, "completed");
    assert.equal(completed.direction, undefined);
    assert.equal(completed.page, 1);
    assert.equal(completed.per_page, ORDERS_API_MAX_PAGE_SIZE);

    const hyphenated = buildInStorageOrdersParams({
      statusTab: "active",
      movement: "all",
      page: 1,
      pageSize: 15,
      search: " re-off ",
    });
    assert.equal(hyphenated.search, "re-off");
  });

  it("caps per_page at the orders API maximum", () => {
    const params = buildInStorageOrdersParams({
      statusTab: "completed",
      movement: "all",
      page: 1,
      pageSize: 100,
    });

    assert.equal(params.per_page, ORDERS_API_MAX_PAGE_SIZE);
  });

  it("sends active statuses as a comma-separated list param", () => {
    assert.deepEqual(ACTIVE_ORDER_STATUSES, [
      "awaiting_response",
      "in_progress",
    ]);
    assert.equal(ACTIVE_ORDER_STATUS_QUERY, "awaiting_response,in_progress");
  });

  it("maps UI movement filters to API direction values", () => {
    assert.equal(mapMovementToApiDirection("inbound"), "into_storage");
    assert.equal(mapMovementToApiDirection("outbound"), "out_of_storage");
    assert.equal(mapMovementToApiDirection("service"), undefined);
    assert.equal(mapMovementToApiDirection("all"), undefined);
  });
});
