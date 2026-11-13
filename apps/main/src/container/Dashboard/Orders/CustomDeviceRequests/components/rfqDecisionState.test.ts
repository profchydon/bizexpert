import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CustomDeviceRequest } from "../types";
import {
  approvalRequestHrefForRfq,
  rfqDecisionStateKey,
  rfqDetailsDrawerPaddingClass,
  selectedAvailableRfqDeviceIds,
  shouldIgnoreQuoteSubmit,
  shouldRouteRfqDecisionToApproval,
} from "./rfqDecisionState";

describe("rfq decision state", () => {
  it("keeps the same state key when a request refreshes in place", () => {
    const initial = { id: "REQ-1", rfqId: "rfq-1" } as CustomDeviceRequest;
    const refreshed = {
      id: "REQ-1",
      rfqId: "rfq-1",
      status: "waiting_for_action",
    } as CustomDeviceRequest;

    assert.equal(rfqDecisionStateKey(initial), rfqDecisionStateKey(refreshed));
  });

  it("blocks duplicate quote submits while loading", () => {
    assert.equal(shouldIgnoreQuoteSubmit(true), true);
    assert.equal(shouldIgnoreQuoteSubmit(false), false);
  });

  it("excludes unavailable devices from RFQ accept payloads", () => {
    const request = {
      devices: [
        {
          responseDeviceId: "quoted-device",
          vendorResponse: { type: "quoted" },
        },
        {
          responseDeviceId: "unavailable-device",
          vendorResponse: { type: "unavailable" },
        },
        {
          responseDeviceId: "alternative-device",
          vendorResponse: { type: "alternative" },
        },
      ],
    } as CustomDeviceRequest;

    assert.deepEqual(
      selectedAvailableRfqDeviceIds(request, new Set([0, 1, 2])),
      ["quoted-device", "alternative-device"],
    );
  });

  it("routes approval-origin RFQ decisions back to the approval modal", () => {
    const request = {
      id: "RFQ-1",
      rfqId: "rfq-1",
      status: "waiting_for_action",
      catalogOrderRequest: {
        id: "request-1",
        catalogId: "catalog-1",
      },
    } as CustomDeviceRequest;

    assert.equal(shouldRouteRfqDecisionToApproval(request), true);
    assert.equal(
      approvalRequestHrefForRfq(request),
      "/dashboard/approvals?catalogId=catalog-1&requestId=request-1",
    );
    assert.equal(rfqDetailsDrawerPaddingClass(request), "pb-56");
    assert.equal(shouldRouteRfqDecisionToApproval(request, false), false);
    assert.equal(approvalRequestHrefForRfq(request, false), null);
    assert.equal(rfqDetailsDrawerPaddingClass(request, false), "pb-24");
  });

  it("keeps normal RFQ decisions in the RFQ drawer", () => {
    const request = {
      id: "RFQ-1",
      rfqId: "rfq-1",
      status: "waiting_for_action",
    } as CustomDeviceRequest;

    assert.equal(shouldRouteRfqDecisionToApproval(request), false);
    assert.equal(approvalRequestHrefForRfq(request), null);
    assert.equal(rfqDetailsDrawerPaddingClass(request), "pb-24");
  });

  it("reserves tall footer space for expired RFQ details", () => {
    const request = {
      id: "RFQ-1",
      rfqId: "rfq-1",
      status: "expired",
    } as CustomDeviceRequest;

    assert.equal(rfqDetailsDrawerPaddingClass(request), "pb-56");
  });
});
