import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  extractEmployeeServiceFee,
  extractOffboardFeeBreakdown,
} from "./offboardFeeBreakdown";

const oneStoredDevice = {
  "01a01bec-3545-720f-8145-3b2278b13c22": {
    fees: {
      plan: { amount: 0 },
      additional_fee: { storage_fee: 25 },
      total_fee: 25,
    },
  },
  fee_summary: {
    total_fee: 131.44,
    total_purchase_price: 0,
    total_onboarding_fee: 0,
    total_offboarding_fee: 0,
    storage_fee: 25,
    insurance_fee: 0,
    platform_fee: 99,
    payment_gateway_fee: 0,
    reassign_fee: 0,
    resale_fee: 0,
    dispose_fee: 0,
    factory_reset_fee: 0,
    device_tax: 0,
    service_tax: 7.44,
    currency: { symbol: "£", code: "GBP" },
    tax_metadata: {
      device_tax_rate: 0.05,
      service_tax_rate: 0.06,
      device_tax_amount: 0,
      service_tax_amount: 7.44,
      tax_label_device: "Sales Tax",
      tax_label_service: "Service Tax",
    },
  },
};

describe("extractEmployeeServiceFee", () => {
  it("reads the employee total_fee from the offboarding quote", () => {
    const disposeQuote = {
      "01a01bec-3545-720f-8145-3b2278b13c22": {
        fees: {
          additional_fee: { dispose_fee: 30, storage_fee: 0 },
          total_fee: 30,
        },
      },
      fee_summary: { total_fee: 136.74, dispose_fee: 30, platform_fee: 99 },
    };

    assert.equal(
      extractEmployeeServiceFee(
        disposeQuote,
        "01a01bec-3545-720f-8145-3b2278b13c22",
      ),
      30,
    );
    assert.equal(
      extractEmployeeServiceFee(oneStoredDevice, "missing-employee"),
      null,
    );
  });
});

describe("extractOffboardFeeBreakdown", () => {
  it("renders the server fee_summary for one stored device", () => {
    const result = extractOffboardFeeBreakdown(
      oneStoredDevice,
      1,
      "at-payment",
    );

    assert.equal(result.total, 131.44);
    assert.equal(result.currencySymbol, "£");
    assert.deepEqual(result.rows, [
      { key: "storage_fee", name: "Storage Fee", value: 25 },
      { key: "platform_fee", name: "Platform Fee", value: 99 },
      { key: "tax", name: "Tax", value: 7.44 },
    ]);
    assert.equal(
      result.rows.reduce((sum, row) => sum + row.value, 0),
      result.total,
    );
  });

  it("does not subtract tax from the employee storage total", () => {
    const result = extractOffboardFeeBreakdown(
      oneStoredDevice,
      1,
      "at-payment",
    );
    const storage = result.rows.find((row) => row.key === "storage_fee");

    assert.equal(storage?.value, 25);
    assert.equal(
      result.rows.some((row) => row.value === 17.56),
      false,
    );
    assert.equal(
      result.rows.some((row) => row.key !== "tax" && row.value === 124),
      false,
    );
  });

  it("leaves tax inside service rows on inclusive display", () => {
    const result = extractOffboardFeeBreakdown(oneStoredDevice, 1, "inclusive");

    assert.equal(
      result.rows.some((row) => row.key === "tax"),
      false,
    );
    assert.equal(
      result.rows.reduce((sum, row) => sum + row.value, 0),
      131.44,
    );
    assert.equal(result.total, 131.44);
  });

  it("returns zeroes without a fee_summary", () => {
    const result = extractOffboardFeeBreakdown(undefined, 0);

    assert.deepEqual(result.rows, []);
    assert.equal(result.total, 0);
    assert.equal(result.currencySymbol, "$");
  });
});

describe("offboard fee summary wiring", () => {
  it("uses the server fee_summary on both offboard fee surfaces", () => {
    const devices = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/useEmployeeOffboardFees.ts",
      "utf8",
    );
    const review = readFileSync(
      "src/container/Dashboard/Employees/OffboardSummary/useOffboardReviewFees.ts",
      "utf8",
    );
    const card = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/ServiceFeeBreakdown.tsx",
      "utf8",
    );

    assert.match(devices, /extractOffboardFeeBreakdown\(/);
    assert.match(review, /extractOffboardFeeBreakdown\(/);
    assert.match(card, /CheckoutFeeRows/);
    assert.doesNotMatch(card, /offboardingFee/);
    assert.doesNotMatch(card, /serviceFees/);

    const lineFee = readFileSync(
      "src/container/Dashboard/Employees/OffboardDevices/useOffboardLineFee.ts",
      "utf8",
    );
    assert.match(lineFee, /extractEmployeeServiceFee/);
    assert.match(lineFee, /buildOffboardFeesRequest/);
    assert.doesNotMatch(lineFee, /feeForDevice/);
  });
});
