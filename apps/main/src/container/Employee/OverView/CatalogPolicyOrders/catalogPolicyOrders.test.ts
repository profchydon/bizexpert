import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogPolicyOrdersToRows,
  getCatalogPolicyOrderItemDetails,
  getCatalogPolicyOrderItemCount,
  getCatalogPolicyOrderQuantity,
  getCatalogPolicyOrderRejectionReason,
  isRejectedCatalogPolicyOrder,
} from "./utils";

describe("employee catalog policy orders", () => {
  it("adapts catalog policy order requests for the overview table", () => {
    const rows = catalogPolicyOrdersToRows({
      catalogPolicy: { id: "policy-1", name: "Onboarding Policy" },
      payload: {
        data: [
          {
            id: "request-1",
            catalog_id: "policy-1",
            status: "pending",
            currency: { id: "currency-1", code: "GBP" },
            total_amount: "1500",
            items: [
              { kit_item_id: "item-1", quantity: 2, amount: 1000 },
              { kit_item_id: "item-2", quantity: 1, amount: 500 },
            ],
          },
        ],
      },
    });

    assert.equal(rows[0].catalogPolicyName, "Onboarding Policy");
    assert.equal(getCatalogPolicyOrderItemCount(rows[0]), 2);
    assert.equal(getCatalogPolicyOrderQuantity(rows[0]), 3);
  });

  it("prefers API catalog policy names when present", () => {
    const rows = catalogPolicyOrdersToRows({
      catalogPolicy: { id: "policy-1", name: "Fallback Policy" },
      payload: [
        {
          id: "request-1",
          catalog_policy: { id: "policy-1", name: "API Policy" },
          items: [],
        },
      ],
    });

    assert.equal(rows[0].catalogPolicyName, "API Policy");
  });

  it("uses fulfillment rows for employee order item details", () => {
    const rows = catalogPolicyOrdersToRows({
      catalogPolicy: { id: "policy-1", name: "Netherland Catalog Policy" },
      payload: {
        data: [
          {
            id: "request-1",
            catalog_id: "policy-1",
            status: "pending",
            items: [],
            fulfillment: {
              summary: {
                marketplace_count: 0,
                rfq_count: 1,
                storage_count: 0,
              },
              marketplace: [],
              storage: [],
              rfq: [
                {
                  kit_item_id: "kit-item-1",
                  quantity: 1,
                  asset_specification: {
                    asset: {
                      name: "Apple MacBook Pro M4",
                      model: { name: "Pro" },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });

    assert.equal(getCatalogPolicyOrderItemCount(rows[0]), 1);
    assert.equal(getCatalogPolicyOrderQuantity(rows[0]), 1);
    assert.deepEqual(getCatalogPolicyOrderItemDetails(rows[0]), [
      {
        id: "kit-item-1",
        model: "Pro",
        name: "Apple MacBook Pro M4",
        quantity: 1,
      },
    ]);
  });

  it("exposes rejection reasons for rejected order requests", () => {
    const rejected = {
      id: "request-1",
      status: "rejected",
      rejection_reason: "Budget has not been approved.",
    };

    assert.equal(isRejectedCatalogPolicyOrder(rejected), true);
    assert.equal(
      getCatalogPolicyOrderRejectionReason(rejected),
      "Budget has not been approved.",
    );
    assert.equal(
      getCatalogPolicyOrderRejectionReason({
        id: "request-2",
        status: "rejected",
        rejection_reason: null,
      }),
      "-",
    );
    assert.equal(
      isRejectedCatalogPolicyOrder({ id: "request-3", status: "pending" }),
      false,
    );
  });
});
