import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import type { DeviceLine } from "@/types/offboard";
import {
  buildServiceFeeTable,
  feeForDevice,
  storageFeeForType,
  sumServiceFees,
} from "./offboardServiceFees";

const nestedFees = {
  Factory_Reset: 20,
  Dispose: 75,
  Storage: {
    Accessories: 15,
    Computer: 25,
    "Laptop/Workstation": 25,
    Macbook: 25,
    Phones: 15,
    Tablet: 15,
  },
  Device_Check: 25,
  Reassignment: 99,
  Resale: 75,
};

const nestedTable = buildServiceFeeTable(nestedFees)!;

const flatTable = buildServiceFeeTable({
  Reassignment: 99,
  Storage: 35,
  Dispose: 75,
  Factory_Reset: 50,
})!;

const line = (overrides: Partial<DeviceLine>): DeviceLine => ({
  id: "l-1",
  name: "Device",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 0,
  ...overrides,
});

describe("buildServiceFeeTable", () => {
  it("returns null when the fees object is missing", () => {
    assert.equal(buildServiceFeeTable(undefined), null);
    assert.equal(buildServiceFeeTable(null), null);
  });

  it("keeps a numeric Storage fee as the fallback", () => {
    assert.deepEqual(flatTable, {
      Storage: 35,
      StorageByType: {},
      Reassignment: 99,
      Dispose: 75,
      Factory_Reset: 50,
    });
  });

  it("maps nested Storage fees by category", () => {
    assert.equal(nestedTable.Storage, 0);
    assert.deepEqual(nestedTable.StorageByType, nestedFees.Storage);
    assert.equal(nestedTable.Reassignment, 99);
    assert.equal(nestedTable.Dispose, 75);
    assert.equal(nestedTable.Factory_Reset, 20);
  });

  it("defaults a missing fee to zero", () => {
    const partial = buildServiceFeeTable({ Storage: 35 });

    assert.equal(partial?.Storage, 35);
    assert.equal(partial?.Dispose, 0);
    assert.equal(partial?.Factory_Reset, 0);
  });
});

describe("storageFeeForType", () => {
  it("reads the category amount from nested Storage", () => {
    assert.equal(storageFeeForType(nestedTable, "Macbook"), 25);
    assert.equal(storageFeeForType(nestedTable, "Laptop/Workstation"), 25);
    assert.equal(storageFeeForType(nestedTable, "Phones"), 15);
    assert.equal(storageFeeForType(nestedTable, "macbook"), 25);
  });

  it("falls back to the numeric Storage fee when no category matches", () => {
    assert.equal(storageFeeForType(flatTable, "Macbook"), 35);
    assert.equal(storageFeeForType(nestedTable, "Monitor"), 0);
    assert.equal(storageFeeForType(nestedTable, null), 0);
  });
});

describe("feeForDevice", () => {
  it("returns zero when the fee table is unavailable", () => {
    assert.equal(feeForDevice("STORE", "None", null), 0);
  });

  it("uses nested Storage for Store by asset type", () => {
    assert.equal(feeForDevice("STORE", "None", nestedTable, "Macbook"), 25);
    assert.equal(
      feeForDevice("DISPOSE", "Destruction Certificate", nestedTable),
      75,
    );
    assert.equal(feeForDevice("REASSIGN", "None", nestedTable), 99);
  });

  it("adds the factory reset fee only for that wipe type", () => {
    assert.equal(
      feeForDevice("STORE", "Full Factory Reset", nestedTable, "Macbook"),
      45,
    );
    assert.equal(
      feeForDevice("REASSIGN", "Full Factory Reset", nestedTable),
      119,
    );
    assert.equal(feeForDevice("STORE", "None", nestedTable, "Macbook"), 25);
    assert.equal(
      feeForDevice("STORE", "Destruction Certificate", nestedTable, "Macbook"),
      25,
    );
  });

  it("does not produce NaN when Storage is a category map", () => {
    const amount = feeForDevice("STORE", "None", nestedTable, "Macbook");
    assert.equal(Number.isFinite(amount), true);
    assert.equal(amount, 25);
  });
});

describe("sumServiceFees", () => {
  it("sums each line fee from the nested table", () => {
    const total = sumServiceFees(
      [
        line({ disposition: "STORE", wipeType: "None", assetType: "Macbook" }),
        line({ id: "l-2", disposition: "DISPOSE", wipeType: "None" }),
        line({
          id: "l-3",
          disposition: "REASSIGN",
          wipeType: "Full Factory Reset",
        }),
      ],
      nestedTable,
    );

    assert.equal(total, 25 + 75 + 119);
  });

  it("returns zero without a fee table", () => {
    assert.equal(sumServiceFees([line({})], null), 0);
  });
});

describe("offboard service fee wiring", () => {
  it("does not price device rows from the service-fees catalog", () => {
    const row = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/AssignedDeviceRow.tsx",
      "utf8",
    );
    const page = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/index.tsx",
      "utf8",
    );
    const review = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/offboardReview.ts",
      "utf8",
    );

    assert.match(row, /useOffboardLineFee/);
    assert.doesNotMatch(row, /feeForDevice/);
    assert.doesNotMatch(review, /feeForDevice/);
    assert.doesNotMatch(page, /useGetServiceFeesQuery/);
    assert.match(page, /buildOffboardReview\(/);
  });
});
