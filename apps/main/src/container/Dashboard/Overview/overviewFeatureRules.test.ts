import assert from "node:assert/strict";
import { test } from "node:test";
import {
  TYPES_DONUT_MAX,
  approvalsBannerCopy,
  shouldShowApprovalsBanner,
  shouldShowSetupBanner,
  shouldShowSetupBannerForQuery,
  shouldUseTypesBarList,
} from "./overviewFeatureRules";

test("types breakdown uses a donut for five or fewer categories", () => {
  assert.equal(shouldUseTypesBarList(0), false);
  assert.equal(shouldUseTypesBarList(TYPES_DONUT_MAX), false);
  assert.equal(shouldUseTypesBarList(TYPES_DONUT_MAX + 1), true);
});

test("approvals banner shows only when work is waiting", () => {
  assert.equal(shouldShowApprovalsBanner(0), false);
  assert.equal(shouldShowApprovalsBanner(2), true);
  assert.equal(shouldShowApprovalsBanner(2, false), false);
});

test("approvals banner copy pluralizes the count", () => {
  assert.deepEqual(approvalsBannerCopy(1), {
    title: "1 onboarding approval needs your review",
    detail: "Review when you have a moment.",
  });
  assert.equal(
    approvalsBannerCopy(3).title,
    "3 onboarding approvals need your review",
  );
});

test("setup banner shows only when inventory is empty", () => {
  assert.equal(shouldShowSetupBanner(0), true);
  assert.equal(shouldShowSetupBanner(14), false);
});

test("setup banner stays available when the entity dashboard errors", () => {
  assert.equal(
    shouldShowSetupBannerForQuery({
      isSuccess: false,
      isError: true,
      isLoading: false,
      inventoryCount: 0,
    }),
    true,
  );
  assert.equal(
    shouldShowSetupBannerForQuery({
      isSuccess: false,
      isError: false,
      isLoading: true,
      inventoryCount: 0,
    }),
    false,
  );
});
