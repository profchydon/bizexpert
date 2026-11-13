import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IOrder, ISubOrder, ITrackingEvent } from "@/types/orders";
import { transformTrackingEvent } from "./transformTracking";

const event = {
  id: "evt-1",
  storage_request_id: "sr-1",
  status: "cancelled",
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-01T00:00:00Z",
} as ITrackingEvent;

const subOrder = {
  status: "completed",
  equipment: { id: "eq-1", title: "MacBook" },
} as ISubOrder;

describe("transformTrackingEvent", () => {
  it("drops cancelled tracking leftover on a completed order", () => {
    const activity = transformTrackingEvent(event, subOrder, {
      status: "completed",
    } as IOrder);
    assert.equal(activity, null);
  });

  it("keeps cancelled tracking when the order is cancelled", () => {
    const activity = transformTrackingEvent(event, subOrder, {
      status: "cancelled",
    } as IOrder);
    assert.equal(activity?.actionTitle, "Cancelled");
  });
});
