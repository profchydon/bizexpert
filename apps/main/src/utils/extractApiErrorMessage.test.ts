import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractApiErrorMessage } from "./extractApiErrorMessage";

describe("extractApiErrorMessage", () => {
  it("reads message and joins the errors array from an RTK error", () => {
    const result = extractApiErrorMessage({
      status: 422,
      data: {
        success: false,
        message: "Wrong status value for equipment(s).",
        errors: ["You cannot offboard an equipment that has no country data."],
      },
    });

    assert.equal(result.title, "Wrong status value for equipment(s).");
    assert.equal(
      result.description,
      "You cannot offboard an equipment that has no country data.",
    );
  });

  it("reads a resolved success:false response without a data wrapper", () => {
    const result = extractApiErrorMessage({
      success: false,
      message: "Payment failed.",
      errors: ["First detail.", "Second detail."],
    });

    assert.equal(result.title, "Payment failed.");
    assert.equal(result.description, "First detail. Second detail.");
  });

  it("supports a string errors value", () => {
    const result = extractApiErrorMessage({
      data: { message: "Bad request.", errors: "Single detail." },
    });

    assert.equal(result.title, "Bad request.");
    assert.equal(result.description, "Single detail.");
  });

  it("uses the field error when the API title is Validation error", () => {
    const result = extractApiErrorMessage({
      status: 422,
      data: {
        success: false,
        message: "Validation error",
        errors: {
          "items.0.equipment_id": [
            "This equipment already has a pending device check.",
          ],
        },
      },
    });

    assert.equal(
      result.title,
      "This equipment already has a pending device check.",
    );
    assert.equal(result.description, undefined);
  });

  it("keeps Validation error when the API sends no field details", () => {
    const result = extractApiErrorMessage({
      data: { message: "Validation error" },
    });

    assert.equal(result.title, "Validation error");
    assert.equal(result.description, undefined);
  });

  it("falls back when there is no message and omits empty descriptions", () => {
    const result = extractApiErrorMessage({ data: { errors: [] } });

    assert.equal(result.title, "Something went wrong. Please try again.");
    assert.equal(result.description, undefined);
  });

  it("uses a custom fallback for nullish input", () => {
    const result = extractApiErrorMessage(undefined, "Could not pay.");

    assert.equal(result.title, "Could not pay.");
    assert.equal(result.description, undefined);
  });

  it("drops a description that repeats or suffixes the global message", () => {
    const result = extractApiErrorMessage({
      data: {
        message:
          "Device checks can only be requested for buy-to-storage equipment.",
        errors: { items: ["to-storage equipment."] },
      },
    });

    assert.equal(
      result.title,
      "Device checks can only be requested for buy-to-storage equipment.",
    );
    assert.equal(result.description, undefined);
  });
});
