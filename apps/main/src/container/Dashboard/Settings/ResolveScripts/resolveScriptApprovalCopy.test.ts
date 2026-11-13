import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveScriptApprovalCopy } from "./resolveScriptApprovalCopy";

describe("resolveScriptApprovalCopy", () => {
  it("explains the empty queue", () => {
    assert.deepEqual(resolveScriptApprovalCopy(0), {
      title: "Nothing to review",
      description:
        "When an employee needs a change on their computer that you have to approve first, it will show up here. They wait in the chat until you decide.",
    });
  });

  it("pluralizes the waiting count", () => {
    assert.equal(
      resolveScriptApprovalCopy(1).title,
      "1 request waiting for your approval",
    );
    assert.equal(
      resolveScriptApprovalCopy(3).title,
      "3 requests waiting for your approval",
    );
  });
});
