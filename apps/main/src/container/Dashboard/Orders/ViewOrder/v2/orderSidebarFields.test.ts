import assert from "node:assert/strict";
import { describe, it } from "node:test";
import dayjs from "dayjs";

import { IOrder } from "@/types/orders";
import {
  getExpectedDateField,
  getExpectedDateLabel,
  getItemsCountText,
} from "./orderSidebarFields";

describe("getItemsCountText", () => {
  it("uses the order quantity when present", () => {
    assert.equal(getItemsCountText({ quantity: "6" } as never), "6 items");
    assert.equal(getItemsCountText({ quantity: "1" } as never), "1 item");
  });

  it("falls back to sub order count", () => {
    assert.equal(
      getItemsCountText({ sub_orders: [{}, {}, {}] } as never),
      "3 items",
    );
  });
});

describe("getExpectedDateLabel", () => {
  it("is instance aware for pending orders", () => {
    assert.equal(
      getExpectedDateLabel({ type: "offboarding" } as never),
      "Expected completion",
    );
    assert.equal(
      getExpectedDateLabel({ type: "buy_to_storage" } as never),
      "Expected at warehouse",
    );
    assert.equal(
      getExpectedDateLabel({ type: "onboarding" } as never),
      "Expected delivery",
    );
  });

  it("switches to the completed label", () => {
    assert.equal(
      getExpectedDateLabel({ type: "offboarding" } as never, true),
      "Completed on",
    );
    assert.equal(
      getExpectedDateLabel({ type: "storage" } as never, true),
      "Stored on",
    );
    assert.equal(
      getExpectedDateLabel({ type: "onboarding" } as never, true),
      "Delivered on",
    );
  });
});

describe("getExpectedDateField", () => {
  it("returns null without an order date", () => {
    assert.equal(getExpectedDateField({} as never), null);
  });

  it("derives an estimate seven days after the order date", () => {
    const order = {
      type: "onboarding",
      order_date: "2026-04-28",
    } as unknown as IOrder;
    const field = getExpectedDateField(order);
    assert.equal(field?.label, "Expected delivery");
    assert.equal(
      field?.value,
      dayjs("2026-04-28").add(7, "day").format("MMM DD, YYYY"),
    );
  });

  it("uses the completion date for stored-on instead of the 7-day estimate", () => {
    const order = {
      type: "buy_to_storage",
      status: "completed",
      order_date: "2026-10-01",
      delivery_date_meta: {
        expected_delivery_on: "2026-10-08",
        completed_on: "2026-10-01",
      },
    } as unknown as IOrder;
    const field = getExpectedDateField(order);
    assert.equal(field?.label, "Stored on");
    assert.equal(field?.value, dayjs("2026-10-01").format("MMM DD, YYYY"));
  });
});
