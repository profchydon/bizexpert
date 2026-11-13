import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import { buildItemSlideoutData } from "@/components/Drawers/OrderDetailItem/itemSlideoutData";
import { buildSlideoutData } from "@/components/Drawers/IndividualEmployee/slideoutData";
import { resolveSubOrderDisplayStatus } from "./table/subOrderCancellationStatus";
import { displayStatusForCompletedOfficeOrder } from "./officeCompletedStatus";

const office = {
  recipient_type: "office",
  office_id: "office-1",
} as ISubOrder;

const employee = { recipient_type: "employee" } as ISubOrder;

describe("displayStatusForCompletedOfficeOrder", () => {
  it("shows completed for a delivered office line on a completed order", () => {
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "in_progress",
        { status: "completed" },
        office,
      ),
      "completed",
    );
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "order_delivered",
        { status: "completed" },
        office,
      ),
      "completed",
    );
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        undefined,
        { status: "completed" },
        office,
      ),
      "completed",
    );
  });

  it("keeps a cancelled office line and an in-flight order", () => {
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "cancelled",
        { status: "completed" },
        office,
      ),
      "cancelled",
    );
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "awaiting_cancellation",
        { status: "completed" },
        office,
      ),
      "awaiting_cancellation",
    );
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "in_progress",
        { status: "in_progress" },
        office,
      ),
      "in_progress",
    );
  });

  it("does not change employee lines on a completed order", () => {
    assert.equal(
      displayStatusForCompletedOfficeOrder(
        "in_progress",
        { status: "completed" },
        employee,
      ),
      "in_progress",
    );
  });
});

describe("completed office order surfaces", () => {
  const order = { status: "completed", type: "onboarding" } as IOrder;
  const row = {
    ...office,
    id: "sub-1",
    status: "completed",
    office_name: "Kigali Branch",
    assets: [{ id: "a1" }],
  } as ISubOrder;

  it("keeps a completed office row completed", () => {
    assert.equal(resolveSubOrderDisplayStatus(row, order), "completed");
  });

  it("shows the order item as completed when the asset status is order_delivered", () => {
    const asset = {
      id: "a1",
      name: "Newly Rayda Macbook",
      status: "order_delivered",
      events: [
        {
          id: "e1",
          status: "order_delivered",
          created_at: "2026-10-10T22:57:00Z",
        },
        {
          id: "e2",
          status: "order_in_transit",
          created_at: "2026-10-10T22:50:00Z",
        },
      ],
    } as unknown as IAsset;
    const data = buildItemSlideoutData(asset, order, row);
    assert.equal(data.status, "completed");
    assert.equal(data.history[0].label, "Order Delivered");
  });

  it("shows the office recipient slideout as completed", () => {
    const data = buildSlideoutData(row, "onboarding", "$", undefined, order);
    assert.equal(data.status, "completed");
  });
});
