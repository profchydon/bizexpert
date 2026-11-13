import { CatalogRuleDetailPage } from "@/container/Dashboard/CatalogPolicies/CatalogRuleDetailPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    openSubRules?: string;
    reviewSelectionLimits?: string;
  }>;
}) {
  const { id } = await params;
  const { openSubRules, reviewSelectionLimits } = await searchParams;
  return (
    <CatalogRuleDetailPage
      ruleId={id}
      openSubRules={openSubRules === "1"}
      reviewSelectionLimits={reviewSelectionLimits === "1"}
    />
  );
}
