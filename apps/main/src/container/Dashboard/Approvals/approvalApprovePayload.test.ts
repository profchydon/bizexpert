import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildApproveOrderRequestArgs } from "./approvalApprovePayload";

const approvalRecord = {
  id: "request-1",
  catalogId: "catalog-1",
  employeeId: "employee-1",
  allowItemSwap: false,
  items: [],
};

describe("approval approve payload", () => {
  it("builds the approve request args for logging", () => {
    assert.deepEqual(
      buildApproveOrderRequestArgs({
        companyId: "company-1",
        id: "request-1",
        options: { acknowledgeBudgetWarning: true },
        record: approvalRecord,
      }),
      {
        catalogId: "catalog-1",
        companyId: "company-1",
        orderRequestId: "request-1",
        payload: { acknowledge_budget_warning: true },
      },
    );
  });

  it("skips missing approval request context", () => {
    assert.equal(
      buildApproveOrderRequestArgs({
        companyId: undefined,
        id: "request-1",
        record: approvalRecord,
      }),
      null,
    );
    assert.equal(
      buildApproveOrderRequestArgs({
        companyId: "company-1",
        id: "request-1",
        record: null,
      }),
      null,
    );
  });
});
