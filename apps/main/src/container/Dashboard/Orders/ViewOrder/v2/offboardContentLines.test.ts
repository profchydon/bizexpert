import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder } from "@/types/orders";
import { buildOffboardContentLines } from "./offboardContentLines";

describe("buildOffboardContentLines", () => {
  it("builds one device line per sub order using equipment data", () => {
    const order = {
      sub_orders: [
        {
          id: "so-1",
          type: "reassign",
          status: "in_progress",
          equipment: {
            title: "MacBook Air M2",
            type: "Laptop",
            serial_number: "C02X1",
            image_url: "img.png",
          },
        },
      ],
    } as unknown as IOrder;

    const lines = buildOffboardContentLines(order);
    assert.equal(lines.length, 1);
    assert.equal(lines[0].name, "MacBook Air M2");
    assert.equal(lines[0].type, "Laptop");
    assert.equal(lines[0].serial, "C02X1");
    assert.equal(lines[0].dispositionLabel, "Reassign");
    assert.equal(lines[0].wipe, null);
    assert.equal(lines[0].deviceCheckIncluded, true);
    assert.equal(lines[0].status, "in_progress");
    assert.equal(lines[0].image, "img.png");
  });

  it("keeps wipe empty and includes a device check for storage", () => {
    const order = {
      sub_orders: [
        { id: "s", type: "storage", status: "pending", equipment: {} },
      ],
    } as unknown as IOrder;

    const lines = buildOffboardContentLines(order);
    assert.equal(lines[0].dispositionLabel, "Store");
    assert.equal(lines[0].wipe, null);
    assert.equal(lines[0].deviceCheckIncluded, true);
  });

  it("reads a sub-order factory_reset wipe as Full Factory Reset", () => {
    const order = {
      sub_orders: [
        {
          id: "s",
          type: "storage",
          status: "pending",
          equipment: {},
          wipe_type: "factory_reset",
          wipe_status: "pending",
        },
      ],
    } as unknown as IOrder;

    const lines = buildOffboardContentLines(order);
    assert.equal(lines[0].wipe, "Full Factory Reset");
    assert.equal(lines[0].deviceCheckIncluded, true);
  });

  it("reads wipe_type when the order includes it", () => {
    const order = {
      sub_orders: [
        {
          id: "s",
          type: "dispose",
          status: "pending",
          equipment: {},
          operations: { wipe_type: "Full Factory Reset" },
        },
      ],
    } as unknown as IOrder;

    const lines = buildOffboardContentLines(order);
    assert.equal(lines[0].wipe, "Full Factory Reset");
    assert.equal(lines[0].deviceCheckIncluded, false);
  });

  it("falls back to asset details when equipment is missing", () => {
    const order = {
      sub_orders: {
        data: [
          {
            id: "so-2",
            type: "resale",
            status: "completed",
            assets: [{ name: "Dell XPS", type: "Laptop", images: ["a.png"] }],
          },
        ],
      },
    } as unknown as IOrder;

    const lines = buildOffboardContentLines(order);
    assert.equal(lines[0].name, "Dell XPS");
    assert.equal(lines[0].serial, "");
    assert.equal(lines[0].image, "a.png");
    assert.equal(lines[0].dispositionLabel, "Resale");
  });

  it("returns an empty list when there are no sub orders", () => {
    assert.equal(buildOffboardContentLines(undefined).length, 0);
  });
});
