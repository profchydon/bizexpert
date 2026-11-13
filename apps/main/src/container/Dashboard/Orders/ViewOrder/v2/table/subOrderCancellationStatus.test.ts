import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder, ISubOrder } from "@/types/orders";
import {
  collectPendingCancellationSubOrderIds,
  isSubOrderAwaitingCancellation,
  resolveSubOrderDisplayStatus,
} from "./subOrderCancellationStatus";

describe("isSubOrderAwaitingCancellation", () => {
  it("detects awaiting_cancellation status on the row", () => {
    assert.equal(
      isSubOrderAwaitingCancellation({
        id: "sub-1",
        status: "awaiting_cancellation",
      } as ISubOrder),
      true,
    );
  });

  it("detects pending cancellation on nested assets", () => {
    assert.equal(
      isSubOrderAwaitingCancellation({
        id: "sub-1",
        status: "in_progress",
        assets: [{ id: "asset-1", status: "awaiting_cancellation" }],
      } as unknown as ISubOrder),
      true,
    );
  });
});

describe("collectPendingCancellationSubOrderIds", () => {
  it("collects ids from grouped request previous_order_status", () => {
    const order = {
      id: "order-1",
      pending_cancellation_request: {
        id: "req-1",
        status: "pending",
        previous_order_status: {
          "sub-1": "in_progress",
          "sub-2": "in_progress",
        },
      },
    } as unknown as IOrder;

    const ids = collectPendingCancellationSubOrderIds(order);
    assert.equal(ids.size, 2);
    assert.ok(ids.has("sub-1"));
    assert.ok(ids.has("sub-2"));
  });
});

describe("resolveSubOrderDisplayStatus", () => {
  it("overrides in_progress when the row is in a pending cancellation scope", () => {
    const row = {
      id: "sub-1",
      employee_id: "emp-1",
      status: "in_progress",
    } as ISubOrder;

    const order = {
      id: "order-1",
      status: "in_progress",
      pending_cancellation_request: {
        id: "req-1",
        status: "pending",
        reason: "Budget constraints",
        previous_order_status: { "sub-1": "in_progress" },
      },
      sub_orders: [row],
    } as unknown as IOrder;

    assert.equal(
      resolveSubOrderDisplayStatus(row, order, {
        cancellationView: "requested",
        cancellationInfo: {
          scope: { kind: "sub-orders", employeeIds: ["emp-1"] },
          reasonId: "budget",
          requestedBy: "Alex",
          requestedAt: "2026-01-01",
          resolution: "pending",
        },
        pendingSubOrderIds: collectPendingCancellationSubOrderIds(order),
      }),
      "awaiting_cancellation",
    );
  });

  it("leaves unaffected sub-orders in progress during partial cancellation", () => {
    const cancelled = {
      id: "sub-1",
      employee_id: "emp-1",
      status: "in_progress",
    } as ISubOrder;
    const active = {
      id: "sub-2",
      employee_id: "emp-2",
      status: "in_progress",
    } as ISubOrder;

    const order = {
      id: "order-1",
      status: "awaiting_cancellation",
      pending_cancellation_request: {
        id: "req-1",
        status: "pending",
        suborder_id: "sub-1",
        previous_order_status: { "sub-1": "in_progress" },
      },
      sub_orders: [cancelled, active],
    } as unknown as IOrder;

    const pendingIds = collectPendingCancellationSubOrderIds(order);

    assert.equal(
      resolveSubOrderDisplayStatus(cancelled, order, {
        cancellationView: "requested",
        pendingSubOrderIds: pendingIds,
      }),
      "awaiting_cancellation",
    );
    assert.equal(
      resolveSubOrderDisplayStatus(active, order, {
        cancellationView: "requested",
        pendingSubOrderIds: pendingIds,
      }),
      "in_progress",
    );
  });
});
