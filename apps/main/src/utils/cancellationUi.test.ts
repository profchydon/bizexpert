import assert from "node:assert/strict";
import test from "node:test";
import { groupedRefundRows, mapApiRefundPreview } from "./refund-preview";
import {
  deriveCancellationView,
  deriveCancellationInfo,
} from "../container/Dashboard/Orders/ViewOrder/v2/cancel/mapCancellationInfo";
import { buildCancelEmployees } from "../container/Dashboard/Orders/ViewOrder/v2/cancel/cancelData";
import { IOrder } from "./types/orders";

test("mapApiRefundPreview maps card rail with destination", () => {
  const preview = mapApiRefundPreview({
    currency: "$",
    payment_method: "card",
    rail: "card",
    amount_paid: 1000,
    spent_services: 100,
    refundable_before_fee: 900,
    gateway_fee: 26.1,
    net_refund: 873.9,
    rows: [
      { label: "Paid", value: 1000 },
      { label: "Payment gateway fee", value: -26.1, deduction: true },
      { label: "You will receive", value: 873.9 },
    ],
    policy_rules: [],
  });

  assert.equal(preview.method, "card");
  assert.match(preview.headline, /\$ 873/);
  assert.ok(preview.destination?.includes("card"));
});

test("groupedRefundRows lists payment then deductions before you will receive", () => {
  const grouped = groupedRefundRows([
    { label: "Devices", value: "$ 800.00", kind: "payment" },
    { label: "Onboarding fee", value: "$ 100.00", kind: "payment" },
    { label: "Paid", value: "$ 900.00", kind: "subtotal" },
    {
      label: "Work already carried out",
      value: "-$ 100.00",
      deduction: true,
      kind: "deduction",
    },
    {
      label: "Payment gateway fee",
      value: "-$ 29.00",
      deduction: true,
      kind: "deduction",
    },
    { label: "You will receive", value: "$ 771.00", kind: "total" },
  ]);

  assert.deepEqual(
    grouped.payments.map((row) => row.label),
    ["Devices", "Onboarding fee"],
  );
  assert.equal(grouped.subtotal?.label, "Paid");
  assert.deepEqual(
    grouped.deductions.map((row) => row.label),
    ["Work already carried out", "Payment gateway fee"],
  );
  assert.equal(grouped.total?.label, "You will receive");
});

test("groupedRefundRows treats a lone Paid row as the payment", () => {
  const grouped = groupedRefundRows([
    { label: "Paid", value: "$ 1,000.00" },
    { label: "You will receive", value: "$ 1,000.00" },
  ]);

  assert.deepEqual(
    grouped.payments.map((row) => row.label),
    ["Paid"],
  );
  assert.equal(grouped.subtotal, null);
  assert.equal(grouped.total?.label, "You will receive");
});

test("deriveCancellationView returns requested for pending request", () => {
  const order = {
    id: "1",
    status: "in_progress",
    pending_cancellation_request: {
      id: "req-1",
      order_id: "1",
      reason: "Ordered by mistake",
      status: "pending",
      requested_by: { id: "u1", name: "Alex", email: "a@b.com" },
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    },
  } as unknown as IOrder;

  assert.equal(deriveCancellationView(order), "requested");
  assert.equal(deriveCancellationInfo(order)?.resolution, "pending");
});

test("deriveCancellationView returns requested for grouped pending scope", () => {
  const order = {
    id: "1",
    status: "in_progress",
    sub_orders: [
      { id: "sub-1", employee_id: "emp-1", status: "in_progress" },
      { id: "sub-2", employee_id: "emp-2", status: "in_progress" },
    ],
    pending_cancellation_request: {
      id: "req-1",
      order_id: "1",
      reason: "Budget constraints",
      status: "pending",
      previous_order_status: { "sub-1": "in_progress" },
      requested_by: { id: "u1", name: "Alex", email: "a@b.com" },
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    },
  } as unknown as IOrder;

  assert.equal(deriveCancellationView(order), "requested");
  assert.equal(deriveCancellationInfo(order)?.scope.kind, "sub-orders");
  assert.deepEqual(deriveCancellationInfo(order)?.scope, {
    kind: "sub-orders",
    employeeIds: ["emp-1"],
  });
});

test("deriveCancellationView returns cancelled for cancelled order", () => {
  const order = {
    id: "1",
    status: "cancelled",
  } as IOrder;

  assert.equal(deriveCancellationView(order), "cancelled");
});

test("buildCancelEmployees accepts paginated sub_orders payload", () => {
  const rows = buildCancelEmployees({
    id: "1",
    type: "onboarding",
    sub_orders: {
      data: [
        {
          id: "sub-1",
          employee_id: "emp-1",
          employee_first_name: "Ada",
          employee_last_name: "Lovelace",
          status: "pending",
          amount: "100",
          assets: [],
        },
      ],
    },
  } as unknown as IOrder);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Ada Lovelace");
});
