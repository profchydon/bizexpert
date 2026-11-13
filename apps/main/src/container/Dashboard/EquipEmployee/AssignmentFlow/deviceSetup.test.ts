import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  configurableTypeIds,
  isConfigurableDevice,
  setupOptionsFor,
  setupOptionsForAll,
} from "./deviceSetup";

const dir = "src/container/Dashboard/EquipEmployee/AssignmentFlow";
const read = (file: string) =>
  readFileSync(join(process.cwd(), dir, file), "utf8");

const assetTypes = [
  { id: "type-laptop", name: "Laptop/Workstation" },
  { id: "type-phone", name: "Phones" },
  { id: "type-tablet", name: "Tablet" },
  { id: "type-accessory", name: "Accessories" },
];
const configurable = configurableTypeIds(assetTypes);

describe("deviceSetup", () => {
  it("treats every asset type from the database except Accessories as configurable", () => {
    assert.deepEqual([...configurable].sort(), [
      "type-laptop",
      "type-phone",
      "type-tablet",
    ]);
    assert.equal(
      configurableTypeIds([{ id: "type-a", name: " accessories " }]).size,
      0,
    );
  });

  it("matches a cart asset by its asset type id", () => {
    assert.equal(
      isConfigurableDevice({ type: "type-laptop" }, configurable),
      true,
    );
    assert.equal(
      isConfigurableDevice(
        { type: "type-accessory", name: "MacBook charger" },
        configurable,
      ),
      false,
    );
  });

  it("does not configure a device whose type is missing or not in the database", () => {
    assert.equal(
      isConfigurableDevice({ name: "Dell Latitude" }, configurable),
      false,
    );
    assert.equal(
      isConfigurableDevice({ type: "type-unknown" }, configurable),
      false,
    );
    assert.equal(
      isConfigurableDevice(
        { type: "type-laptop" },
        configurableTypeIds(undefined),
      ),
      false,
    );
  });

  it("offers ABM for Apple devices and Intune for the rest", () => {
    assert.deepEqual(
      setupOptionsFor(
        { type: "type-laptop", name: "MacBook Air" },
        configurable,
      ).map((option) => option.value),
      ["ABM"],
    );
    assert.deepEqual(
      setupOptionsFor(
        { type: "type-laptop", name: "ThinkPad X1" },
        configurable,
      ).map((option) => option.value),
      ["MI"],
    );
    assert.deepEqual(
      setupOptionsFor({ type: "type-accessory" }, configurable),
      [],
    );
  });

  it("combines options across a mixed selection and ignores accessories", () => {
    assert.deepEqual(
      setupOptionsForAll(
        [
          { type: "type-laptop", name: "MacBook Pro" },
          { type: "type-phone", name: "Galaxy S24" },
          { type: "type-accessory", name: "USB-C hub" },
        ],
        configurable,
      ).map((option) => option.value),
      ["MI", "ABM"],
    );
    assert.deepEqual(
      setupOptionsForAll([{ type: "type-accessory" }], configurable),
      [],
    );
  });

  it("reads configurable types from the asset types endpoint", () => {
    const hook = read("useConfigurableTypeIds.ts");
    const row = read("DeviceRow.tsx");
    const page = read("index.tsx");
    const bar = read("BatchActionBar.tsx");

    assert.match(hook, /useGetAssetTypesQuery\(\)/);
    assert.match(hook, /configurableTypeIds\(data\?\.data\)/);
    assert.match(row, /useConfigurableTypeIds\(\)/);
    assert.match(row, /cannot be enrolled in a mobile device manager/);
    assert.match(page, /useConfigurableTypeIds\(\)/);
    assert.match(
      page,
      /isConfigurableDevice\(\s*unit\.cartItem\.asset \?\? \{\},\s*configurableTypes,/,
    );
    assert.match(bar, /batchSetupOptions\.length > 0 &&/);
  });

  it("keeps the config request enabled before a destination is chosen", () => {
    const pickerUsage = (file: string) => {
      const source = read(file);
      const start = source.indexOf("<SetupPicker");
      return source.slice(start, source.indexOf("/>", start));
    };

    assert.doesNotMatch(pickerUsage("DeviceRow.tsx"), /isDisabled/);
    assert.doesNotMatch(pickerUsage("BatchActionBar.tsx"), /isDisabled/);
  });
});
