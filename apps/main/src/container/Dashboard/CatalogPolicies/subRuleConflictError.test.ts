import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getSubRuleConflictError } from "./subRuleConflictError";

describe("sub rule conflict errors", () => {
  it("extracts conflict messages from create sub rule errors", () => {
    const parsed = getSubRuleConflictError({
      data: {
        errors: {
          conflicts: [
            {
              message: "This rule conflicts with New Policy. Adjust criteria.",
            },
          ],
          requires_acknowledgment: false,
        },
      },
    });

    assert.deepEqual(parsed, {
      messages: ["This rule conflicts with New Policy. Adjust criteria."],
      requiresAcknowledgment: false,
    });
  });

  it("tracks when conflict acknowledgement is required", () => {
    const parsed = getSubRuleConflictError({
      data: {
        errors: {
          conflicts: [{ message: "Acknowledge this conflict." }],
          requires_acknowledgment: true,
        },
      },
    });

    assert.equal(parsed?.requiresAcknowledgment, true);
  });

  it("ignores non-conflict errors", () => {
    assert.equal(
      getSubRuleConflictError({ data: { message: "Failed" } }),
      null,
    );
  });
});
