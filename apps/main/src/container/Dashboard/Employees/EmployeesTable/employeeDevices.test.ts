import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getEmployeeDevicePreview,
  getOffboardEligibility,
  hasAssignedDevices,
  MAX_VISIBLE_DEVICES,
} from "./employeeDevices";

const withDevices = { id: "a", equipment_count: 2 };
const withoutDevices = { id: "b", equipment_count: 0 };

describe("getEmployeeDevicePreview", () => {
  it("returns an empty preview when there are no devices", () => {
    const preview = getEmployeeDevicePreview({ equipment_count: 0 });

    assert.equal(preview.count, 0);
    assert.equal(preview.visibleCount, 0);
    assert.equal(preview.extraCount, 0);
    assert.deepEqual(preview.items, []);
  });

  it("maps real equipment items with images", () => {
    const preview = getEmployeeDevicePreview({
      equipment_count: 2,
      equipment: [
        { id: "a", title: "MacBook Pro", image_url: "/macbook.png" },
        { id: "b", title: "iPhone 15", image_url: null },
      ],
    });

    assert.equal(preview.count, 2);
    assert.equal(preview.visibleCount, 2);
    assert.equal(preview.extraCount, 0);
    assert.deepEqual(preview.items, [
      { id: "a", title: "MacBook Pro", imageUrl: "/macbook.png" },
      { id: "b", title: "iPhone 15", imageUrl: null },
    ]);
  });

  it("caps visible items and reports the overflow count", () => {
    const equipment = Array.from({ length: 5 }, (_, index) => ({
      id: `device-${index}`,
      title: `Device ${index}`,
      image_url: null,
    }));

    const preview = getEmployeeDevicePreview({
      equipment_count: 5,
      equipment,
    });

    assert.equal(preview.items.length, MAX_VISIBLE_DEVICES);
    assert.equal(preview.visibleCount, MAX_VISIBLE_DEVICES);
    assert.equal(preview.extraCount, 5 - MAX_VISIBLE_DEVICES);
  });

  it("falls back to the count when only equipment_count is present", () => {
    const preview = getEmployeeDevicePreview({ equipment_count: 4 });

    assert.equal(preview.count, 4);
    assert.equal(preview.visibleCount, MAX_VISIBLE_DEVICES);
    assert.equal(preview.extraCount, 4 - MAX_VISIBLE_DEVICES);
    assert.deepEqual(preview.items, []);
  });

  it("uses the larger of equipment_count and array length", () => {
    const preview = getEmployeeDevicePreview({
      equipment_count: 1,
      equipment: [
        { id: "a", title: "Laptop", image_url: null },
        { id: "b", title: "Monitor", image_url: null },
      ],
    });

    assert.equal(preview.count, 2);
    assert.equal(preview.extraCount, 0);
  });

  it("handles null and undefined input safely", () => {
    const preview = getEmployeeDevicePreview(null);

    assert.equal(preview.count, 0);
    assert.deepEqual(preview.items, []);
  });
});

describe("hasAssignedDevices", () => {
  it("is false when equipment_count is 0 and there is no equipment", () => {
    assert.equal(hasAssignedDevices({ equipment_count: 0 }), false);
    assert.equal(hasAssignedDevices(null), false);
    assert.equal(hasAssignedDevices(undefined), false);
  });

  it("is true when equipment_count is positive", () => {
    assert.equal(hasAssignedDevices({ equipment_count: 3 }), true);
  });

  it("is true when the equipment array has items", () => {
    assert.equal(
      hasAssignedDevices({
        equipment_count: 0,
        equipment: [{ id: "a", title: "Laptop", image_url: null }],
      }),
      true,
    );
  });
});

describe("getOffboardEligibility", () => {
  it("is not off-boardable when nothing is selected", () => {
    const result = getOffboardEligibility([]);
    assert.equal(result.canOffboard, false);
    assert.equal(result.excludedCount, 0);
    assert.deepEqual(result.offboardableRows, []);
  });

  it("is off-boardable when every selected row has assigned devices", () => {
    const result = getOffboardEligibility([withDevices, withDevices]);
    assert.equal(result.canOffboard, true);
    assert.equal(result.excludedCount, 0);
  });

  it("is blocked when any selected row has no assigned devices", () => {
    const result = getOffboardEligibility([withDevices, withoutDevices]);
    assert.equal(result.canOffboard, false);
    assert.equal(result.excludedCount, 1);
    assert.deepEqual(result.offboardableRows, [withDevices]);
  });

  it("is blocked when no selected row has assigned devices", () => {
    const result = getOffboardEligibility([withoutDevices, withoutDevices]);
    assert.equal(result.canOffboard, false);
    assert.equal(result.excludedCount, 2);
  });
});
