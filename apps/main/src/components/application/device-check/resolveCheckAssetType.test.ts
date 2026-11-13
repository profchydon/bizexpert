import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCheckPhotos } from "./checkPhotos";
import { getDeviceCheckSchema } from "./checkSchema";
import { resolveCheckAssetLookup } from "./resolveCheckAssetType";

describe("resolveCheckAssetLookup", () => {
  it("maps API and inventory asset types onto schema keys", () => {
    assert.equal(resolveCheckAssetLookup("Laptop/Workstation"), "laptop");
    assert.equal(resolveCheckAssetLookup("Smartphone"), "phone");
    assert.equal(resolveCheckAssetLookup("Phones"), "phone");
    assert.equal(resolveCheckAssetLookup("Input Device"), "keyboard");
    assert.equal(resolveCheckAssetLookup("Audio / Visual"), "headphones");
    assert.equal(resolveCheckAssetLookup("Display"), "display");
    assert.equal(resolveCheckAssetLookup("Tablet"), "tablet");
  });

  it("selects the laptop schema for Laptop/Workstation", () => {
    const schema = getDeviceCheckSchema("Laptop/Workstation");
    assert.deepEqual(
      schema.conditions.map((field) => field.label),
      ["Screen", "Chassis", "Keyboard", "Ports", "Trackpad", "Camera"],
    );
    assert.equal(schema.minPhotos, 4);
    assert.equal(
      getCheckPhotos("Laptop/Workstation")[0],
      "/devices/checks/laptop/1.jpg",
    );
  });
});
