import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildOffboardReview } from "./buildOffboardReview";
import { buildServiceFeeTable } from "./offboardFeeTable";
import type { DeviceLine } from "@/types/offboard";

const line = (overrides: Partial<DeviceLine> = {}): DeviceLine => ({
  id: "l-1",
  equipmentId: "eq-1",
  name: "iPhone",
  serial: "SN-1",
  imageUrl: null,
  assetType: "Phones",
  disposition: "STORE",
  wipeType: "None",
  fee: 0,
  ...overrides,
});

describe("buildOffboardReview", () => {
  it("applies the asset-type storage fee to each selected device", () => {
    const feeTable = buildServiceFeeTable({
      Storage: { Phones: 15, "Laptop/Workstation": 25 },
    });

    const review = buildOffboardReview({
      employees: [{ id: "emp-1", name: "State One" }],
      devices: {
        getSelectedLines: () => [
          line(),
          line({ id: "l-2", assetType: "Laptop" }),
        ],
      } as any,
      windows: {
        getWindow: () => ({ start: "2026-01-01", end: "2026-01-08" }),
      } as any,
      feeTable,
    });

    assert.equal(review[0].devices[0].fee, 15);
    assert.equal(review[0].devices[1].fee, 25);
  });
});
