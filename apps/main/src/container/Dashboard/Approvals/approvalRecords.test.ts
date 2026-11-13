import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getApprovalListQuerySkips } from "./approvalRecordQuery";

describe("approval record queries", () => {
  it("fetches only pending approvals on the awaiting tab", () => {
    assert.deepEqual(
      getApprovalListQuerySkips({
        activeTab: "awaiting",
        companyId: "company-1",
      }),
      { skipAll: true, skipPending: false },
    );
  });

  it("fetches only all order requests outside the awaiting tab", () => {
    assert.deepEqual(
      getApprovalListQuerySkips({
        activeTab: "all",
        companyId: "company-1",
      }),
      { skipAll: false, skipPending: true },
    );
  });
});
