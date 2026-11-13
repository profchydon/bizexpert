"use client";

import { Hourglass02 } from "@untitledui/icons";
import { Button } from "@/components/ui/button";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { useGetCatalogPolicyOrderRequestApprovalStatsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequestApprovalStats";
import { approvalStatsToCounts } from "@/container/Dashboard/Approvals/utils";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useWorkspaceScopedCompanyArgs } from "@/hooks/useWorkspaceScopedCompanyArgs";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import {
  approvalsBannerCopy,
  shouldShowApprovalsBanner,
} from "./overviewFeatureRules";

export function ApprovalsBanner() {
  const { companyId } = useWorkspaceScopedCompanyArgs();
  const { access, activeEntityId } = useActiveWorkspace();
  const { push, isPending } = useTransitionRouter();
  const canReviewAccountApprovals = access.isGlobalAdmin && !activeEntityId;
  const statsQuery = useGetCatalogPolicyOrderRequestApprovalStatsQuery(
    { companyId: companyId ?? "" },
    { skip: !companyId || !canReviewAccountApprovals },
  );
  const awaiting =
    approvalStatsToCounts(statsQuery.data?.data?.stats)?.awaiting ?? 0;

  if (!shouldShowApprovalsBanner(awaiting, canReviewAccountApprovals)) {
    return null;
  }

  const copy = approvalsBannerCopy(awaiting);

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-utility-warning-200 bg-utility-warning-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <FeaturedIcon
          size="md"
          color="warning"
          theme="light"
          icon={Hourglass02}
        />
        <div>
          <p className="text-sm font-semibold text-utility-warning-700">
            {copy.title}
          </p>
          <p className="text-sm text-utility-warning-600">{copy.detail}</p>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="primary"
        isLoading={isPending}
        onClick={() => push(routes.APPROVALS)}
        data-testid="approvalsbanner-button"
      >
        Review approvals
      </Button>
    </div>
  );
}
