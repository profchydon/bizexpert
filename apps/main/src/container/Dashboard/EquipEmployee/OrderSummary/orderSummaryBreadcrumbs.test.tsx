import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ReactElement } from "react";
import { isValidElement } from "react";

import routes from "@/routes";
import { orderSummaryBreadcrumbs } from "./orderSummaryBreadcrumbs";

describe("order summary breadcrumbs", () => {
  it("uses approval breadcrumbs for approval order summary flows", () => {
    const breadcrumbs = orderSummaryBreadcrumbs({
      isApprovalFlow: true,
      isUnassigned: false,
    });

    assert.equal(breadcrumbs.length, 2);
    const approvals = breadcrumbs[0];
    assert.equal(isValidElement(approvals), true);
    const approvalElement = approvals as ReactElement<{
      children: string;
      href: string;
    }>;
    assert.deepEqual(approvalElement.props.href, routes.APPROVALS);
    assert.equal(approvalElement.props.children, "Approvals");
  });
});
