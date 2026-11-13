import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOffboardFeeEquipment,
  buildOffboardFeeOrders,
  formatFeeAmount,
} from "./offboardFeeBreakdown";
import type { DeviceLine } from "@/types/offboard";

const line = (overrides: Partial<DeviceLine>): DeviceLine => ({
  id: "l-1",
  equipmentId: "eq-1",
  name: "Device",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 0,
  ...overrides,
});

describe("buildOffboardFeeEquipment", () => {
  it("maps each disposition to its flag", () => {
    const equipment = buildOffboardFeeEquipment([
      line({ id: "l-1", equipmentId: "eq-1", disposition: "STORE" }),
      line({ id: "l-2", equipmentId: "eq-2", disposition: "REASSIGN" }),
      line({ id: "l-3", equipmentId: "eq-3", disposition: "DISPOSE" }),
    ]);

    assert.deepEqual(equipment, [
      { equipment_id: "eq-1", quantity: 1, storage: true },
      { equipment_id: "eq-2", quantity: 1, reassign: true },
      { equipment_id: "eq-3", quantity: 1, dispose: true },
    ]);
  });

  it("adds factory_reset only for the full factory reset wipe", () => {
    const [withReset, withoutReset] = buildOffboardFeeEquipment([
      line({ id: "l-1", equipmentId: "eq-1", wipeType: "Full Factory Reset" }),
      line({
        id: "l-2",
        equipmentId: "eq-2",
        disposition: "DISPOSE",
        wipeType: "Destruction Certificate",
      }),
    ]);

    assert.equal(withReset.factory_reset, true);
    assert.equal(withoutReset.factory_reset, undefined);
  });

  it("falls back to the line id when equipmentId is missing", () => {
    const [equipment] = buildOffboardFeeEquipment([
      line({ id: "l-9", equipmentId: "" }),
    ]);

    assert.equal(equipment.equipment_id, "l-9");
  });
});

describe("buildOffboardFeeOrders", () => {
  it("keys equipment by employee and skips employees without devices", () => {
    const orders = buildOffboardFeeOrders([
      { id: "emp-1", devices: [line({ equipmentId: "eq-1" })] },
      { id: "emp-2", devices: [] },
    ]);

    assert.deepEqual(Object.keys(orders), ["emp-1"]);
    assert.deepEqual(orders["emp-1"].equipment, [
      { equipment_id: "eq-1", quantity: 1, storage: true },
    ]);
  });
});

describe("formatFeeAmount", () => {
  it("prefixes the symbol and adds thousands separators", () => {
    assert.equal(formatFeeAmount(1500, "$"), "$1,500");
    assert.equal(formatFeeAmount(0, "£"), "£0");
  });
});
