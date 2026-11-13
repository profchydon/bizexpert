import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder } from "@/types/orders";
import {
  getOrderDeviceConfigs,
  normalizeDeviceConfig,
} from "./orderDeviceConfig";

describe("normalizeDeviceConfig", () => {
  it("maps real device_setup values to a config", () => {
    assert.equal(normalizeDeviceConfig("ABM"), "apple-business-manager");
    assert.equal(
      normalizeDeviceConfig("apple business manager"),
      "apple-business-manager",
    );
    assert.equal(normalizeDeviceConfig("MI"), "intune");
    assert.equal(normalizeDeviceConfig("Microsoft Intune"), "intune");
  });

  it("returns null for empty/none/unknown values", () => {
    assert.equal(normalizeDeviceConfig(""), null);
    assert.equal(normalizeDeviceConfig(null), null);
    assert.equal(normalizeDeviceConfig("none"), null);
    assert.equal(normalizeDeviceConfig("whatever"), null);
  });
});

describe("getOrderDeviceConfigs", () => {
  it("collects distinct configs from real asset device_setup", () => {
    const order = {
      sub_orders: [
        { assets: [{ device_setup: "ABM" }] },
        { assets: [{ device_setup: "MI" }, { device_setup: "ABM" }] },
      ],
    } as unknown as IOrder;

    assert.deepEqual(getOrderDeviceConfigs(order), [
      "apple-business-manager",
      "intune",
    ]);
  });

  it("reads equipment device_setup and array shapes", () => {
    const order = {
      sub_orders: [
        { equipment: { device_setup: "Intune" } },
        { assets: [{ device_setup: ["ABM"] }] },
      ],
    } as unknown as IOrder;

    assert.deepEqual(getOrderDeviceConfigs(order), [
      "apple-business-manager",
      "intune",
    ]);
  });

  it("returns nothing when no real config is present", () => {
    const order = {
      sub_orders: [{ assets: [{ device_setup: "none" }, {}] }],
    } as unknown as IOrder;

    assert.deepEqual(getOrderDeviceConfigs(order), []);
  });
});
