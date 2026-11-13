import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRfqDeviceProperties,
  createEmptyDevice,
  createExtendedSpecRow,
  customDeviceSpecificationOptions,
  formatRfqDeviceDescription,
  getCustomSpecValueOptions,
  hasRequiredSpecification,
  isDeviceFilled,
} from "./data";

describe("custom device request modal data", () => {
  it("provides unique structured specification options for the RFQ UI", () => {
    const values = customDeviceSpecificationOptions.map(
      (option) => option.value,
    );

    assert.equal(new Set(values).size, values.length);
    assert.ok(values.includes("condition"));
    assert.ok(values.includes("screen-size"));
    assert.ok(values.includes("keyboard"));
  });

  it("uses master catalog preset value suggestions", () => {
    assert.deepEqual(
      getCustomSpecValueOptions("condition", "").map((option) => option.label),
      ["Brand New", "Used", "Refurbished", "Open Box"],
    );
    assert.ok(getCustomSpecValueOptions("processor", "").length > 0);
    assert.ok(getCustomSpecValueOptions("keyboard", "").length > 0);
  });

  it("keeps custom values available alongside preset suggestions", () => {
    assert.ok(
      getCustomSpecValueOptions("processor", "M3 Pro").some(
        (option) => option.value === "M3 Pro",
      ),
    );
    assert.ok(getCustomSpecValueOptions("storage", "512GB SSD").length > 0);
  });

  it("requires both description and a completed specification", () => {
    const device = {
      ...createEmptyDevice("1"),
      deviceName: "MacBook Pro",
      assetType: "Laptop",
      quantity: "2",
    };

    assert.equal(isDeviceFilled(device), false);
    assert.equal(
      isDeviceFilled({
        ...device,
        description: "Needs 16GB RAM and 512GB storage.",
      }),
      false,
    );
    assert.equal(
      isDeviceFilled({
        ...device,
        extendedSpecs: [
          { id: "1", key: "condition", value: "" },
          { id: "2", key: "ram", value: "16GB DDR5 5200MHz" },
        ],
      }),
      false,
    );
    assert.equal(
      isDeviceFilled({
        ...device,
        description: "Needs 16GB RAM and 512GB storage.",
        extendedSpecs: [
          { id: "1", key: "condition", value: "Brand New" },
          { id: "2", key: "ram", value: "16GB DDR5 5200MHz" },
        ],
      }),
      true,
    );
  });

  it("treats incomplete specs as missing", () => {
    assert.equal(
      hasRequiredSpecification({
        ...createEmptyDevice("1"),
        extendedSpecs: [
          { id: "1", key: "ram", value: "" },
          { id: "2", key: "", value: "US ANSI" },
        ],
      }),
      false,
    );
  });

  it("creates additional spec rows with incrementing ids", () => {
    assert.deepEqual(createExtendedSpecRow([]), {
      id: "1",
      key: "",
      value: "",
    });
    assert.deepEqual(
      createExtendedSpecRow([{ id: "4", key: "Colour", value: "Black" }]),
      { id: "5", key: "", value: "" },
    );
  });

  it("formats RFQ description from optional notes only", () => {
    assert.equal(
      formatRfqDeviceDescription({
        ...createEmptyDevice("1"),
        description: "Needs to be vendor sourced.",
        extendedSpecs: [
          { id: "1", key: "Keyboard layout", value: "US ANSI" },
          { id: "2", key: "power_adapter", value: "Type J - Switzerland" },
          { id: "3", key: "ram", value: "" },
        ],
      }),
      "Needs to be vendor sourced.",
    );
  });

  it("builds RFQ properties from completed specification rows", () => {
    assert.deepEqual(
      buildRfqDeviceProperties({
        ...createEmptyDevice("1"),
        extendedSpecs: [
          { id: "1", key: "ram", value: "16GB" },
          { id: "2", key: "storage", value: "512GB SSD" },
          { id: "3", key: "processor", value: "M3 Pro" },
          { id: "4", key: "keyboard", value: "" },
        ],
      }),
      {
        RAM: "16GB",
        storage: "512GB SSD",
        processor: "M3 Pro",
      },
    );
  });
});
