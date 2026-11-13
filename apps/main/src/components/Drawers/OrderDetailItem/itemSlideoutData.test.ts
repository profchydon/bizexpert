import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import { buildItemSlideoutData } from "./itemSlideoutData";

const asset = {
  id: "a1",
  name: "MacBook Air",
  make: "Apple",
  model: "M1",
  status: "completed",
  signature_requested: true,
  tracking_no: "TRK-1",
  device_setup: "ABM",
  asset_pricing: { amount: "574", currency: { symbol: "£" } },
  events: [
    { id: "e1", status: "order_placed", created_at: "2026-05-01T09:00:00Z" },
    { id: "e2", status: "delivered", created_at: "2026-05-04T09:00:00Z" },
  ],
} as unknown as IAsset;

describe("buildItemSlideoutData", () => {
  it("builds real fields and marks the latest event current", () => {
    const order = {
      order_number: "RE-ONB-1",
      type: "onboarding",
      order_date: "2026-05-01",
    } as unknown as IOrder;
    const sub = { assets: [{ id: "x" }, asset] } as unknown as ISubOrder;
    const data = buildItemSlideoutData(asset, order, sub);
    assert.equal(data.index, 1);
    assert.equal(data.title, "MacBook Air Apple M1");
    assert.equal(data.price, "£574.00");
    assert.equal(data.tracking, "TRK-1");
    assert.equal(data.externalTrackingLink, undefined);
    assert.equal(data.courierName, undefined);
    assert.equal(data.configLabel, "ABM");
    assert.equal(data.isOffboarding, false);
    assert.equal(data.history[0].label, "Delivered");
    assert.equal(data.history[0].current, true);
    assert.equal(data.history[1].current, false);
  });

  it("uses off-boarding caption and hides configuration", () => {
    const order = {
      order_number: "RE-OFB-1",
      type: "offboarding",
    } as unknown as IOrder;
    const data = buildItemSlideoutData(asset, order, undefined);
    assert.equal(data.isOffboarding, true);
    assert.equal(data.configLabel, undefined);
    assert.match(data.historyCaption, /retrieval/);
  });

  it("uses the sub-order external tracking link when the asset has none", () => {
    const data = buildItemSlideoutData(
      { id: "b", name: "Samsung Max" } as unknown as IAsset,
      { order_number: "RE-OFF-1", type: "offboarding" } as unknown as IOrder,
      {
        tracking_no: "OFF-EVQSE26",
        external_tracking_link: "https://track.dhl.com/123",
        courier_name: "DHL",
      } as unknown as ISubOrder,
    );
    assert.equal(data.tracking, "OFF-EVQSE26");
    assert.equal(data.externalTrackingLink, "https://track.dhl.com/123");
    assert.equal(data.courierName, "DHL");
  });

  it("falls back gracefully with no pricing or events", () => {
    const data = buildItemSlideoutData(
      { id: "b", name: "Monitor" } as unknown as IAsset,
      { order_number: "RE-1", type: "onboarding" } as unknown as IOrder,
      undefined,
    );
    assert.equal(data.price, "—");
    assert.equal(data.history.length, 0);
    assert.equal(data.title, "Monitor");
  });
});
