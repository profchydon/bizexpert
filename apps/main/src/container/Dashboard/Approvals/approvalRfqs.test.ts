import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPendingApprovalRfqs } from "./approvalRfqs";

describe("approval RFQ summaries", () => {
  it("returns RFQs that should remain viewable from approval details", () => {
    const rfqs = getPendingApprovalRfqs({
      id: "request-1",
      rfqs: [
        { id: "rfq-1", request_id: "RFQ-1", status: "pending" },
        { id: "rfq-2", request_id: "RFQ-2", status: "approved" },
        { id: "rfq-3", request_id: "RFQ-3", status: "accepted" },
        { id: "rfq-4", request_id: "RFQ-4", status: "declined" },
      ],
    });

    assert.deepEqual(rfqs, [
      { id: "rfq-1", requestId: "RFQ-1", status: "pending" },
      { id: "rfq-2", requestId: "RFQ-2", status: "approved" },
      { id: "rfq-3", requestId: "RFQ-3", status: "accepted" },
      { id: "rfq-4", requestId: "RFQ-4", status: "declined" },
    ]);
  });
});
