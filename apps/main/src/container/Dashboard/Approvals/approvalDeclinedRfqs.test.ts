import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  approvalHasOnlyRfqItems,
  approvalRfqFooterWarning,
  approvalRfqNoticeVariant,
  shouldBlockApprovalForRfq,
  shouldDisableApprovalPrimaryAction,
  shouldFetchApprovalRfqDetail,
} from "./approvalModalInteraction";
import type { ApprovalRecord } from "./types";

const baseRecord: ApprovalRecord = {
  id: "request-1",
  catalogId: "catalog-1",
  employeeId: "employee-1",
  allowItemSwap: false,
  items: [],
};

describe("declined approval RFQs", () => {
  it("keeps declined RFQs viewable and non-blocking", () => {
    assert.equal(shouldFetchApprovalRfqDetail("declined"), true);
    assert.equal(shouldFetchApprovalRfqDetail("rejected"), true);
    assert.equal(
      approvalRfqNoticeVariant({ detailStatus: "declined" }),
      "quote_declined",
    );
    assert.deepEqual(
      approvalRfqFooterWarning({
        record: {
          ...baseRecord,
          items: [
            { id: "item-1", source: "MARKETPLACE" },
            { id: "item-2", source: "RFQ" },
          ],
        },
        variant: "quote_declined",
      }),
      {
        blocksApproval: false,
        title: "Some RFQ items can’t be fulfilled",
        description:
          "The rejected RFQ quote means those items won’t move forward. You can still approve the items that don’t depend on the RFQ.",
      },
    );
    assert.equal(
      shouldBlockApprovalForRfq({
        detailStatus: "declined",
        isDetailLoading: false,
        summaryStatus: "declined",
      }),
      false,
    );
  });

  it("blocks approval when every item depends on a declined RFQ", () => {
    const record: ApprovalRecord = {
      ...baseRecord,
      items: [
        { id: "item-1", source: "RFQ" },
        { id: "item-2", source: "RFQ" },
      ],
    };
    const footerWarning = approvalRfqFooterWarning({
      record,
      variant: "quote_declined",
    });

    assert.equal(approvalHasOnlyRfqItems(record), true);
    assert.deepEqual(footerWarning, {
      blocksApproval: true,
      title: "This request can’t be approved",
      description:
        "Every item in this request depends on an RFQ quote that was rejected, so there’s nothing available to approve. Review the RFQ details or reject the request.",
    });
    assert.equal(
      shouldDisableApprovalPrimaryAction({
        budgetWarningAcknowledged: false,
        hasBlockingRfq: false,
        hasUnapprovableRfqItems: footerWarning?.blocksApproval,
        primaryActionLabel: "Approve",
        requiresBudgetAcknowledgement: false,
        saving: false,
      }),
      true,
    );
  });
});
