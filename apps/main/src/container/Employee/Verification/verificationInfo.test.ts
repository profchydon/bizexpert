import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EmployeeVerificationData } from "@/types/employeeVerification";
import {
  getActiveVerificationInfo,
  getActiveVerificationNotes,
  getExpectedDate,
  isPickupContext,
} from "./verificationInfo";

const base = (
  overrides: Partial<EmployeeVerificationData> = {},
): EmployeeVerificationData =>
  ({
    order_number: "RE-OFF-1",
    can_edit: true,
    can_toggle_signature: true,
    signature_required: false,
    signature_info_banner: null,
    verification_status: "verification_pending",
    ...overrides,
  }) as EmployeeVerificationData;

describe("getActiveVerificationInfo", () => {
  it("returns pickup_info for a pickup context", () => {
    const data = base({
      verification_context: "pickup",
      pickup_info: { recipient_name: "Smith With" } as any,
      delivery_info: { recipient_name: "Someone Else" } as any,
    });
    assert.equal(getActiveVerificationInfo(data)?.recipient_name, "Smith With");
  });

  it("returns delivery_info for a delivery context", () => {
    const data = base({
      verification_context: "delivery",
      pickup_info: { recipient_name: "Smith With" } as any,
      delivery_info: { recipient_name: "Jane Doe" } as any,
    });
    assert.equal(getActiveVerificationInfo(data)?.recipient_name, "Jane Doe");
  });

  it("falls back to pickup_info when the delivery block is missing", () => {
    const data = base({
      verification_context: "delivery",
      pickup_info: { recipient_name: "Smith With" } as any,
    });
    assert.equal(getActiveVerificationInfo(data)?.recipient_name, "Smith With");
  });

  it("returns undefined when there is no data", () => {
    assert.equal(getActiveVerificationInfo(), undefined);
  });
});

describe("getActiveVerificationNotes", () => {
  it("reads pickup_note for pickup and delivery_notes for delivery", () => {
    assert.equal(
      getActiveVerificationNotes(
        base({ verification_context: "pickup", pickup_note: "leave at gate" }),
      ),
      "leave at gate",
    );
    assert.equal(
      getActiveVerificationNotes(
        base({ verification_context: "delivery", delivery_notes: "ring bell" }),
      ),
      "ring bell",
    );
  });
});

describe("getExpectedDate", () => {
  it("prefers expected_delivery, then expected_pickup", () => {
    assert.equal(
      getExpectedDate(base({ expected_delivery: "2026-07-01" })),
      "2026-07-01",
    );
    assert.equal(
      getExpectedDate(base({ expected_pickup: "2026-07-21" })),
      "2026-07-21",
    );
    assert.equal(getExpectedDate(base()), "");
  });
});

describe("isPickupContext", () => {
  it("is true only when the context is pickup", () => {
    assert.equal(
      isPickupContext(base({ verification_context: "pickup" })),
      true,
    );
    assert.equal(
      isPickupContext(base({ verification_context: "delivery" })),
      false,
    );
    assert.equal(isPickupContext(base()), false);
  });
});
