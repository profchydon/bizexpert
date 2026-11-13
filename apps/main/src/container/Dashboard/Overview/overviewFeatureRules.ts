export const TYPES_DONUT_MAX = 5;

export function shouldUseTypesBarList(categoryCount: number) {
  return categoryCount > TYPES_DONUT_MAX;
}

export function shouldShowApprovalsBanner(
  awaitingCount: number,
  canReviewAccountApprovals = true,
) {
  return canReviewAccountApprovals && awaitingCount > 0;
}

export function shouldShowSetupBanner(inventoryCount: number) {
  return inventoryCount === 0;
}

export function shouldShowSetupBannerForQuery({
  isSuccess,
  isError,
  isLoading,
  inventoryCount,
}: {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  inventoryCount: number;
}) {
  if (isLoading) return false;
  if (isError) return true;
  return isSuccess && shouldShowSetupBanner(inventoryCount);
}

export function approvalsBannerCopy(awaitingCount: number) {
  const noun = awaitingCount === 1 ? "approval" : "approvals";

  return {
    title: `${awaitingCount} onboarding ${noun} ${
      awaitingCount === 1 ? "needs" : "need"
    } your review`,
    detail: "Review when you have a moment.",
  };
}
