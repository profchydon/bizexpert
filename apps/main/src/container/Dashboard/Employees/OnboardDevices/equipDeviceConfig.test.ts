import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getDefaultDeviceConfig,
  getDeviceConfigLabel,
  isDeviceConfigurable,
} from "./equipDeviceConfig";

describe("isDeviceConfigurable", () => {
  it("is true for configurable categories", () => {
    assert.equal(isDeviceConfigurable({ category: "Laptop" }), true);
    assert.equal(isDeviceConfigurable({ category: "Smartphone" }), true);
    assert.equal(isDeviceConfigurable({ category: "Macbook" }), true);
    assert.equal(isDeviceConfigurable({ category: "Workstation" }), true);
  });

  it("is false for monitors and accessories", () => {
    assert.equal(isDeviceConfigurable({ category: "Monitor" }), false);
    assert.equal(isDeviceConfigurable({ category: "Accessories" }), false);
  });

  it("is false for accessories or missing category", () => {
    assert.equal(isDeviceConfigurable({ category: "Accessory" }), false);
    assert.equal(isDeviceConfigurable({ category: undefined }), false);
  });
});

describe("getDefaultDeviceConfig", () => {
  it("prefers ABM for Apple laptops", () => {
    assert.equal(
      getDefaultDeviceConfig({ name: "MacBook Pro", category: "Laptop" }),
      "ABM",
    );
  });

  it("prefers Intune for Windows laptops", () => {
    assert.equal(
      getDefaultDeviceConfig({ name: "Dell XPS 15", category: "Laptop" }),
      "MI",
    );
  });

  it("prefers ABM for Apple Macbook category devices", () => {
    assert.equal(
      getDefaultDeviceConfig({
        name: "Apple MacBook Air M2",
        category: "Macbook",
      }),
      "ABM",
    );
  });

  it("returns none for non-configurable devices", () => {
    assert.equal(
      getDefaultDeviceConfig({ name: "USB-C Hub", category: "Accessory" }),
      "none",
    );
  });
});

describe("getDeviceConfigLabel", () => {
  it("maps config keys to labels", () => {
    assert.equal(getDeviceConfigLabel("MI"), "Intune");
    assert.equal(getDeviceConfigLabel("ABM"), "ABM");
    assert.equal(getDeviceConfigLabel("none"), "None");
  });
});
