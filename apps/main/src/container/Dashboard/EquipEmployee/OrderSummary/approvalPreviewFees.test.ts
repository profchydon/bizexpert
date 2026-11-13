import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEmployees } from "@/types/employees";
import {
  approvalPreviewEmployeeFees,
  approvalPreviewFees,
  approvalSummaryMeta,
} from "./approvalPreviewFees";

describe("approval preview fees", () => {
  it("maps preview payment option fees into order summary totals", () => {
    const result = approvalPreviewFees(
      {
        data: {
          order_request: { currency: { code: "GBP", symbol: "£" } },
          preview: {
            payment_options: {
              Credit: {
                fee_summary: {
                  total_purchase_price: 21650,
                  total_onboarding_fee: 350,
                  payment_gateway_fee: 0,
                  total_fee: 22000,
                },
                onboarding_items: 6,
                storage_items: 0,
              },
            },
          },
        },
      },
      "Credit",
    );

    assert.equal(result.totalEquipment, 6);
    assert.equal(result.totalFeesSummary?.currency.symbol, "£");
    assert.equal(result.totalFeesSummary?.total_fee, 22000);
    assert.deepEqual(result.totalFeesArray, [
      {
        key: "total_purchase_price",
        name: "Total Purchase Price",
        value: 21650,
      },
      { key: "total_onboarding_fee", name: "Total Onboarding Fee", value: 350 },
    ]);
  });

  it("maps preview employee fee breakdown for equipment summary", () => {
    const fees = approvalPreviewEmployeeFees(
      {
        data: {
          preview: {
            payment_options: {
              Credit: {
                fee_breakdown: {
                  onboarding: {
                    fees: {
                      "employee-1": {
                        fees: { items: 7, purchase_price: 21650 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "Credit",
      "employee-1",
    );

    assert.deepEqual(fees, { items: 7, purchase_price: 21650 });
  });

  it("falls back to persisted approval metadata when URL params are absent", () => {
    const result = approvalSummaryMeta(new URLSearchParams(), [
      {
        approvalAcknowledgeBudgetWarning: true,
        approvalCatalogId: "catalog-1",
        requestId: "request-1",
      } as unknown as IEmployees,
    ]);

    assert.deepEqual(result, {
      acknowledgeBudgetWarning: true,
      catalogId: "catalog-1",
      orderRequestId: "request-1",
      returnPath: undefined,
    });
  });

  it("reads the approval return path from URL params", () => {
    const params = new URLSearchParams({
      approvalCatalogId: "catalog-1",
      approvalOrderRequestId: "request-1",
      approvalReturnPath: "/employee",
    });

    assert.equal(approvalSummaryMeta(params, []).returnPath, "/employee");
  });
});
