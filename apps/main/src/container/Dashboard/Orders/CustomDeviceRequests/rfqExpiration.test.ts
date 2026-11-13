import assert from "node:assert/strict";
import { describe, it } from "node:test";
import dayjs from "dayjs";

import type { CustomDeviceRequest } from "./types";
import {
  canActOnRfqQuote,
  isRfqQuotePastExpiry,
  resolveRfqStatus,
} from "./rfqExpiration";

describe("rfq expiration", () => {
  const now = dayjs("2026-07-29T12:00:00.000Z");

  it("detects quotes past their expiry timestamp", () => {
    assert.equal(isRfqQuotePastExpiry("2026-07-28T23:59:59.000Z", now), true);
    assert.equal(isRfqQuotePastExpiry("2026-07-29T12:00:00.000Z", now), true);
    assert.equal(isRfqQuotePastExpiry("2026-07-29T12:00:01.000Z", now), false);
    assert.equal(isRfqQuotePastExpiry(undefined, now), false);
  });

  it("maps waiting_for_action RFQs to expired after the quote window ends", () => {
    assert.equal(
      resolveRfqStatus(
        "waiting_for_action",
        "2026-07-20T08:00:00.000Z",
        false,
        now,
      ),
      "expired",
    );
    assert.equal(
      resolveRfqStatus(
        "waiting_for_action",
        "2026-08-05T08:00:00.000Z",
        false,
        now,
      ),
      "waiting_for_action",
    );
    assert.equal(
      resolveRfqStatus("pending", "2026-07-20T08:00:00.000Z", false, now),
      "pending",
    );
    assert.equal(
      resolveRfqStatus("waiting_for_action", null, true, now),
      "expired",
    );
  });

  it("blocks confirm and reject actions on expired quotes", () => {
    assert.equal(
      canActOnRfqQuote({ status: "expired" } as CustomDeviceRequest),
      false,
    );
    assert.equal(
      canActOnRfqQuote({ status: "waiting_for_action" } as CustomDeviceRequest),
      true,
    );
  });
});
