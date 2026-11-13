import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { approvalOrderSummaryPath } from "./approvalOrderSummaryPath";

describe("approval order summary path", () => {
  it("uses the dashboard order summary route by default", () => {
    assert.equal(
      approvalOrderSummaryPath({
        catalogId: "catalog-1",
        orderRequestId: "request-1",
      }),
      "/dashboard/equip-employee/order-summary?approvalAcknowledgeBudgetWarning=false&approvalCatalogId=catalog-1&approvalOrderRequestId=request-1",
    );
  });

  it("uses the employee order summary route for employee approval flows", () => {
    assert.equal(
      approvalOrderSummaryPath({
        catalogId: "catalog-1",
        orderRequestId: "request-1",
        returnPath: "/employee",
      }),
      "/employee/order-summary?approvalAcknowledgeBudgetWarning=false&approvalCatalogId=catalog-1&approvalOrderRequestId=request-1&approvalReturnPath=%2Femployee",
    );
  });
});
