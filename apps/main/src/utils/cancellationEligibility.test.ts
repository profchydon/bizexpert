import test from "node:test";
import assert from "node:assert/strict";
import {
  canCancelFromStatus,
  canShowOrderCancelButton,
  allSubOrdersCancelled,
  deriveOrderDisplayStatus,
  hasUncancellableDevices,
  isInstantCancellation,
  subOrderCanCancel,
} from "./cancellationEligibility";
import { deriveCancellationView } from "../container/Dashboard/Orders/ViewOrder/v2/cancel/mapCancellationInfo";
import type { IOrder, ISubOrder } from "@/types/orders";

test("canCancelFromStatus returns true when API says cancellable", () => {
  assert.equal(
    canCancelFromStatus({
      can_cancel: true,
      has_pending_request: false,
      pending_request_id: null,
      status: "pending",
    }),
    true,
  );
});

test("canShowOrderCancelButton uses order cancellation_status when present", () => {
  const order = {
    type: "onboarding",
    status: "in_progress",
    cancellation_status: {
      can_cancel: true,
      has_pending_request: false,
      pending_request_id: null,
      status: "in_progress",
    },
  } as unknown as IOrder;

  assert.equal(canShowOrderCancelButton(order), true);
  assert.equal(hasUncancellableDevices(order), false);
});

test("subOrderCanCancel falls back to asset cancellation_status", () => {
  const subOrder = {
    assets: [
      {
        cancellation_status: {
          can_cancel: true,
          has_pending_request: false,
          pending_request_id: null,
          status: "order_placed",
        },
      },
    ],
  } as unknown as ISubOrder;

  assert.equal(subOrderCanCancel(subOrder), true);
});

test("isInstantCancellation is true when API marks cancellation as instant", () => {
  const order = {
    cancellation_status: {
      can_cancel: true,
      instant: true,
      has_pending_request: false,
      pending_request_id: null,
      status: "in_progress",
    },
  } as unknown as IOrder;

  assert.equal(isInstantCancellation(order), true);
});

test("isInstantCancellation is false when vendor has accepted", () => {
  const order = {
    cancellation_status: {
      can_cancel: true,
      instant: false,
      has_pending_request: false,
      pending_request_id: null,
      status: "in_progress",
    },
  } as unknown as IOrder;

  assert.equal(isInstantCancellation(order), false);
});

test("canShowOrderCancelButton ignores already-cancelled sub-orders in fallback mode", () => {
  const order = {
    type: "onboarding",
    status: "in_progress",
    sub_orders: [
      {
        id: "sub-1",
        status: "cancelled",
        cancellation_status: {
          can_cancel: false,
          has_pending_request: false,
          pending_request_id: null,
          status: "cancelled",
        },
      },
      {
        id: "sub-2",
        status: "in_progress",
        cancellation_status: {
          can_cancel: true,
          has_pending_request: false,
          pending_request_id: null,
          status: "order_placed",
        },
      },
      {
        id: "sub-3",
        status: "in_progress",
        cancellation_status: {
          can_cancel: true,
          has_pending_request: false,
          pending_request_id: null,
          status: "order_placed",
        },
      },
    ],
  } as unknown as IOrder;

  assert.equal(canShowOrderCancelButton(order), true);
  assert.equal(hasUncancellableDevices(order), false);
});

test("allSubOrdersCancelled returns true when every sub-order is cancelled", () => {
  const order = {
    status: "in_progress",
    sub_orders: [
      { id: "1", status: "cancelled" },
      { id: "2", status: "order_cancelled" },
    ],
  } as unknown as IOrder;

  assert.equal(allSubOrdersCancelled(order), true);
  assert.equal(deriveOrderDisplayStatus(order), "cancelled");
});

test("deriveCancellationView returns cancelled when all sub-orders are cancelled", () => {
  const order = {
    status: "in_progress",
    sub_orders: [
      { id: "1", status: "cancelled" },
      { id: "2", status: "cancelled" },
      { id: "3", status: "cancelled" },
    ],
  } as unknown as IOrder;

  assert.equal(deriveCancellationView(order), "cancelled");
});

test("canShowOrderCancelButton is false when API denies order cancel", () => {
  const order = {
    type: "onboarding",
    status: "in_progress",
    cancellation_status: {
      can_cancel: false,
      cutoff_reason: "onboarding_in_transit",
      has_pending_request: false,
      pending_request_id: null,
      status: "in_progress",
    },
  } as unknown as IOrder;

  assert.equal(canShowOrderCancelButton(order), false);
});
