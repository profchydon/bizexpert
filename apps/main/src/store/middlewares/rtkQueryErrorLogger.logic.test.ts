import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  collectRtkQueryErrorMessages,
  shouldReportRtkQueryErrorToSentry,
} from "./rtkQueryErrorLogger.logic";

describe("shouldReportRtkQueryErrorToSentry", () => {
  it("reports server errors", () => {
    assert.equal(shouldReportRtkQueryErrorToSentry(500), true);
    assert.equal(shouldReportRtkQueryErrorToSentry(503), true);
  });

  it("skips expected client errors", () => {
    assert.equal(shouldReportRtkQueryErrorToSentry(401), false);
    assert.equal(shouldReportRtkQueryErrorToSentry(404), false);
    assert.equal(shouldReportRtkQueryErrorToSentry(422), false);
  });

  it("reports missing or non-numeric statuses", () => {
    assert.equal(shouldReportRtkQueryErrorToSentry(undefined), true);
    assert.equal(shouldReportRtkQueryErrorToSentry("network"), true);
  });
});

describe("collectRtkQueryErrorMessages", () => {
  it("flattens field validation errors into one toast", () => {
    assert.deepEqual(
      collectRtkQueryErrorMessages({
        status: 422,
        data: {
          errors: {
            email: ["Email is invalid"],
            name: ["Name is required"],
          },
        },
      }),
      ["Email is invalid Name is required"],
    );
  });

  it("uses the API message when no field errors exist", () => {
    assert.deepEqual(
      collectRtkQueryErrorMessages({
        status: 400,
        data: { message: "Unable to process request" },
      }),
      ["Unable to process request"],
    );
  });

  it("prefers the global API message over field error fragments", () => {
    assert.deepEqual(
      collectRtkQueryErrorMessages({
        status: 422,
        data: {
          message:
            "Device checks can only be requested for buy-to-storage equipment.",
          errors: {
            "items.0.equipment_id": ["to-storage equipment."],
          },
        },
      }),
      ["Device checks can only be requested for buy-to-storage equipment."],
    );
  });

  it("shows the field error instead of Validation error", () => {
    assert.deepEqual(
      collectRtkQueryErrorMessages({
        status: 422,
        data: {
          message: "Validation error",
          errors: {
            "items.0.equipment_id": [
              "This equipment already has a pending device check.",
            ],
          },
        },
      }),
      ["This equipment already has a pending device check."],
    );
  });

  it("falls back to a generic message", () => {
    assert.deepEqual(collectRtkQueryErrorMessages(undefined), [
      "Something went wrong",
    ]);
  });
});
