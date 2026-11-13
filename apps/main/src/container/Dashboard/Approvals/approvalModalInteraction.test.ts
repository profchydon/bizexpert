import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  approvalDialogModalLayer,
  approvalRfqNoticeVariant,
  firstPendingRfqId,
  hasPendingApprovalRfq,
  hasOpenDrawer,
  shouldBlockApprovalForRfq,
  shouldCloseFromApprovalOverlay,
  shouldCloseModalAfterApprovalAction,
  shouldDisableApprovalPrimaryAction,
  shouldFetchApprovalRfqDetail,
  shouldShowApprovalModalBodyLoader,
} from "./approvalModalInteraction";

describe("approval modal interaction", () => {
  it("keeps the dialog layer mode stable while drawers open", () => {
    assert.equal(approvalDialogModalLayer, false);
  });

  it("keeps normal outside dismissal when no drawer is open", () => {
    assert.equal(hasOpenDrawer(false, false), false);
  });

  it("suspends outside dismissal when the RFQ details drawer is open", () => {
    assert.equal(hasOpenDrawer(true, false), true);
  });

  it("suspends outside dismissal when the item swap drawer is open", () => {
    assert.equal(hasOpenDrawer(false, true), true);
  });

  it("keeps overlay clicks from closing while a drawer is open", () => {
    assert.equal(shouldCloseFromApprovalOverlay(true), false);
    assert.equal(shouldCloseFromApprovalOverlay(false), true);
  });

  it("keeps the approval modal open after approve or convert actions", () => {
    assert.equal(shouldCloseModalAfterApprovalAction("convert_to_rfq"), false);
    assert.equal(shouldCloseModalAfterApprovalAction("approve"), false);
    assert.equal(shouldCloseModalAfterApprovalAction("reject"), true);
  });

  it("shows the body loader while modal-related endpoints are loading", () => {
    assert.equal(
      shouldShowApprovalModalBodyLoader({
        detailsLoading: true,
        rfqDetailLoading: false,
      }),
      true,
    );
    assert.equal(
      shouldShowApprovalModalBodyLoader({
        detailsLoading: false,
        rfqDetailLoading: true,
      }),
      true,
    );
    assert.equal(
      shouldShowApprovalModalBodyLoader({
        detailsLoading: false,
        rfqDetailLoading: false,
      }),
      false,
    );
  });

  it("selects the first pending RFQ id for the details drawer", () => {
    assert.equal(
      firstPendingRfqId({
        id: "approval-1",
        catalogId: "catalog-1",
        employeeId: "employee-1",
        allowItemSwap: false,
        items: [],
        pendingRfqs: [{ id: "rfq-1" }, { id: "rfq-2" }],
      }),
      "rfq-1",
    );
  });

  it("disables approve while an RFQ is waiting for a response", () => {
    const record = {
      id: "approval-1",
      catalogId: "catalog-1",
      employeeId: "employee-1",
      allowItemSwap: false,
      items: [],
      pendingRfqs: [{ id: "rfq-1" }],
    };

    assert.equal(hasPendingApprovalRfq(record), true);
    assert.equal(
      shouldDisableApprovalPrimaryAction({
        budgetWarningAcknowledged: false,
        hasBlockingRfq: true,
        primaryActionLabel: "Approve",
        requiresBudgetAcknowledgement: false,
        saving: false,
      }),
      true,
    );
  });

  it("fetches approved RFQs and shows quote-ready copy from the real status", () => {
    assert.equal(shouldFetchApprovalRfqDetail("accepted"), true);
    assert.equal(shouldFetchApprovalRfqDetail("approved"), true);
    assert.equal(shouldFetchApprovalRfqDetail("waiting_for_action"), true);
    assert.equal(
      approvalRfqNoticeVariant({
        detailStatus: "waiting_for_action",
        summaryStatus: "approved",
      }),
      "quote_ready",
    );
    assert.equal(
      shouldBlockApprovalForRfq({
        detailStatus: "waiting_for_action",
        isDetailLoading: false,
        summaryStatus: "approved",
      }),
      true,
    );
  });

  it("shows accepted RFQs as viewable and non-blocking", () => {
    assert.equal(
      approvalRfqNoticeVariant({
        detailStatus: "accepted",
        summaryStatus: "approved",
      }),
      "quote_accepted",
    );
    assert.equal(
      approvalRfqNoticeVariant({
        summaryStatus: "accepted",
      }),
      "quote_accepted",
    );
    assert.equal(
      shouldBlockApprovalForRfq({
        detailStatus: "accepted",
        isDetailLoading: false,
        summaryStatus: "accepted",
      }),
      false,
    );
  });

  it("disables approve when an RFQ is waiting for action", () => {
    assert.equal(
      shouldBlockApprovalForRfq({
        detailStatus: "waiting_for_action",
        isDetailLoading: false,
        summaryStatus: "approved",
      }),
      true,
    );
    assert.equal(
      shouldDisableApprovalPrimaryAction({
        budgetWarningAcknowledged: false,
        hasBlockingRfq: true,
        primaryActionLabel: "Approve",
        requiresBudgetAcknowledgement: false,
        saving: false,
      }),
      true,
    );
  });

  it("enables approve after the RFQ detail status is approved", () => {
    const hasBlockingRfq = shouldBlockApprovalForRfq({
      detailStatus: "approved",
      isDetailLoading: false,
      summaryStatus: "waiting_for_action",
    });

    assert.equal(hasBlockingRfq, false);
    assert.equal(
      shouldDisableApprovalPrimaryAction({
        budgetWarningAcknowledged: false,
        hasBlockingRfq,
        primaryActionLabel: "Approve",
        requiresBudgetAcknowledgement: false,
        saving: false,
      }),
      false,
    );
  });
});
