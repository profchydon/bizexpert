import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOffboardReview,
  employeeReviewTotal,
  reviewGrandTotal,
  type OffboardReviewEmployee,
} from "./offboardReview";
import type { DeviceLine } from "./offboardPricing";

const line = (overrides: Partial<DeviceLine>): DeviceLine => ({
  id: "l-1",
  name: "Device",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 105,
  ...overrides,
});

const employee = (
  overrides: Partial<OffboardReviewEmployee>,
): OffboardReviewEmployee => ({
  id: "e-1",
  name: "Olivia Rhye",
  role: "Product Designer",
  country: "United States",
  devices: [],
  ...overrides,
});

describe("buildOffboardReview", () => {
  it("keeps the server-stamped line fee", () => {
    const review = buildOffboardReview(
      [{ id: "e-1", name: "Tunji Ade", role: "Engineer", country: "UK" }],
      () => ({ start: "2026-01-01", end: "2026-01-03" }),
      () => [
        line({
          assetType: "Macbook",
          disposition: "DISPOSE",
          wipeType: "Destruction Certificate",
          fee: 30,
        }),
      ],
    );

    assert.equal(review[0]?.devices[0]?.fee, 30);
    assert.equal(review[0]?.devices[0]?.assetType, "Macbook");
  });
});

describe("employeeReviewTotal", () => {
  it("sums the device fees for an employee", () => {
    assert.equal(
      employeeReviewTotal(
        employee({
          devices: [line({}), line({ id: "l-2" }), line({ id: "l-3" })],
        }),
      ),
      315,
    );
  });

  it("is 0 when an employee has no devices", () => {
    assert.equal(employeeReviewTotal(employee({ devices: [] })), 0);
  });
});

describe("reviewGrandTotal", () => {
  it("adds every employee total together", () => {
    assert.equal(
      reviewGrandTotal([
        employee({ id: "a", devices: [line({}), line({ id: "l-2" })] }),
        employee({ id: "b", devices: [] }),
        employee({ id: "c", devices: [line({ id: "l-3", fee: 130 })] }),
      ]),
      340,
    );
  });

  it("is 0 for an empty review", () => {
    assert.equal(reviewGrandTotal([]), 0);
  });
});
