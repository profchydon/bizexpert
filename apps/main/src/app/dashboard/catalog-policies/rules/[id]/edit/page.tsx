import { CatalogRuleFormPage } from "@/container/Dashboard/CatalogPolicies/CatalogRuleFormPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CatalogRuleFormPage ruleId={id} />;
}
