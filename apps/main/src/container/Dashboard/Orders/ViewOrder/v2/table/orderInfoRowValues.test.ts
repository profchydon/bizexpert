import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ISubOrder } from "@/types/orders";
import {
  buildRowValues,
  formatWindow,
  getRowSignatureRequested,
  sortRowValues,
  type OrderInfoRowValues,
} from "./orderInfoRowValues";

describe("getRowSignatureRequested", () => {
  it("reads the asset flag for onboarding", () => {
    const row = { assets: [{ signature_requested: true }] } as never;
    assert.equal(getRowSignatureRequested(row, "onboarding"), true);
  });

  it("reads the sub-order flag for off-boarding", () => {
    const row = { signature_requested: true } as never;
    assert.equal(getRowSignatureRequested(row, "offboarding"), true);
    assert.equal(getRowSignatureRequested({} as never, "offboarding"), false);
  });
});

describe("formatWindow", () => {
  it("formats a start/end range", () => {
    const row = {
      collection_date_start: "2026-05-03",
      collection_date_end: "2026-05-10",
    } as unknown as ISubOrder;
    assert.equal(formatWindow(row), "May 3 – May 10, 2026");
  });

  it("falls back to a single date, then null", () => {
    assert.equal(
      formatWindow({ collection_date: "2026-05-03" } as never),
      "May 3, 2026",
    );
    assert.equal(formatWindow({} as never), null);
  });
});

describe("buildRowValues", () => {
  it("derives initials, amount and window", () => {
    const row = {
      id: "1",
      employee_first_name: "Emily",
      employee_last_name: "Clarke",
      job_title: "UX Designer",
      address: "44 Brick Lane",
      total_amount: "39500",
      status: "in_progress",
      assets: [{ signature_requested: true }],
    } as unknown as ISubOrder;
    const values = buildRowValues(row, "onboarding", "£");
    assert.equal(values.initials, "EC");
    assert.equal(values.amount, "£39,500.00");
    assert.equal(values.signatureRequested, true);
    assert.equal(values.window, null);
  });

  it("falls back to the pickup address for off-boarding", () => {
    const row = {
      id: "2",
      employee_first_name: "Bola",
      employee_last_name: "Alimosho",
      address: "",
      order_details: { from: { address: "12 Pickup Rd, Lagos" } },
    } as unknown as ISubOrder;
    assert.equal(
      buildRowValues(row, "offboarding", "£").address,
      "12 Pickup Rd, Lagos",
    );
  });
});

describe("sortRowValues", () => {
  const rows = [
    { name: "Bravo", amountValue: 10 },
    { name: "alpha", amountValue: 30 },
  ] as OrderInfoRowValues[];

  it("sorts by name case-insensitively", () => {
    assert.equal(sortRowValues(rows, "name", "asc")[0].name, "alpha");
    assert.equal(sortRowValues(rows, "name", "desc")[0].name, "Bravo");
  });

  it("sorts numerically by amount", () => {
    assert.equal(sortRowValues(rows, "amount", "asc")[0].amountValue, 10);
  });
});
