import assert from "node:assert/strict";
import test from "node:test";
import { buildCancelledRefundPreview } from "../container/Dashboard/Orders/ViewOrder/v2/cancel/buildCancelledRefundPreview";
import { IOrder } from "./types/orders";

test("buildCancelledRefundPreview uses stored cancellation_refund_preview", () => {
  const order = {
    id: "1",
    status: "cancelled",
    total_amount: "9999",
    payment_method: "Credit",
    currency: "£",
    cancellation_refund_preview: {
      currency: "£",
      payment_method: "Credit",
      rail: "credit-wallet",
      amount_paid: 4314.22,
      spent_services: 0,
      refundable_before_fee: 4314.22,
      gateway_fee: 0,
      net_refund: 4314.22,
      rows: [
        { label: "Paid", value: 4314.22 },
        { label: "You will receive", value: 4314.22 },
      ],
      policy_rules: [],
    },
  } as unknown as IOrder;

  const preview = buildCancelledRefundPreview(order, []);

  assert.equal(preview.net, 4314.22);
  assert.equal(preview.method, "credit-wallet");
  assert.match(preview.headline, /4,314/);
});

test("buildCancelledRefundPreview falls back to order total without double counting employees", () => {
  const order = {
    id: "1",
    status: "cancelled",
    total_amount: "4314.22",
    payment_method: "Credit",
    currency: "£",
  } as unknown as IOrder;

  const preview = buildCancelledRefundPreview(order, [
    {
      id: "emp-1",
      employeeId: "emp-1",
      name: "Ada",
      status: "cancelled",
      amount: 6065000,
      items: [
        {
          id: "item-1",
          employeeId: "emp-1",
          name: "Laptop",
          price: 6065000,
          fulfillmentStage: "cancelled",
          cancelled: true,
        },
      ],
    },
  ]);

  assert.equal(preview.net, 4314.22);
});
