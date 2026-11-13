import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  clearApprovalRequestUrl,
  approvalPaymentResultUrl,
  approvalRequestIdFromUrl,
  approvalRequestUrl,
} from "./approvalUrl";

describe("approval URL helpers", () => {
  it("normalizes request IDs when Stripe appends status into the value", () => {
    assert.equal(
      approvalRequestIdFromUrl("request-1?status=successful"),
      "request-1",
    );
  });

  it("builds payment verification result URLs", () => {
    assert.equal(
      approvalPaymentResultUrl({
        catalogId: "catalog-1",
        isSuccess: true,
        pathname: "/dashboard/approvals",
        requestId: "request-1",
      }),
      "/dashboard/approvals?catalogId=catalog-1&requestId=request-1&success_instance=true",
    );
  });

  it("builds approval request modal URLs", () => {
    assert.equal(
      approvalRequestUrl({
        catalogId: "catalog-1",
        pathname: "/dashboard/approvals",
        requestId: "request-1",
      }),
      "/dashboard/approvals?catalogId=catalog-1&requestId=request-1",
    );
  });

  it("can restore the approval modal while dropping payment params", () => {
    assert.equal(
      approvalRequestUrl({
        pathname: "/dashboard/approvals",
        requestId: "request-1",
      }),
      "/dashboard/approvals?requestId=request-1",
    );
  });

  it("removes requestId while preserving other approval params", () => {
    assert.equal(
      clearApprovalRequestUrl(
        "/dashboard/approvals",
        "catalogId=catalog-1&requestId=request-1",
      ),
      "/dashboard/approvals?catalogId=catalog-1",
    );
  });

  it("returns the pathname when requestId was the only query param", () => {
    assert.equal(
      clearApprovalRequestUrl("/dashboard/approvals", "requestId=request-1"),
      "/dashboard/approvals",
    );
  });
});
