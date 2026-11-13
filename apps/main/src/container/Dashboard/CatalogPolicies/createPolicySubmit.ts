import type { CatalogPolicyApiRequest } from "@/types/catalogPolicy";
import routes from "@/routes";

import type { CreatePolicyOptions } from "./components/wizard/AddPolicyWizard.types";
import { ruleToPolicyPayload } from "./apiAdapters";
import type { CatalogRule } from "./types";

type CreatePolicyTrigger = (args: {
  companyId: string;
  payload: CatalogPolicyApiRequest;
}) => {
  unwrap: () => Promise<{ data: { id: string; name: string } }>;
};

export async function submitCreateCatalogPolicy({
  companyId,
  createPolicy,
  rule,
  options,
  currentUserId,
  notify,
  navigate,
}: {
  companyId: string;
  createPolicy: CreatePolicyTrigger;
  rule: CatalogRule;
  options?: CreatePolicyOptions;
  currentUserId?: string;
  notify: (title: string, description?: string) => void;
  navigate: (href: string) => void;
}) {
  const payload = ruleToPolicyPayload(rule, {
    acknowledgeDisplacement: options?.acknowledgeDisplacement ?? false,
    currentUserId,
    forceRuleActive: true,
    selectionCategoryIds: options?.selectionCategoryIds ?? [],
  });
  const response = await createPolicy({
    companyId,
    payload,
  }).unwrap();
  notify(
    "Policy created",
    `${response.data.name} was added to Catalog Policy.`,
  );
  const params = new URLSearchParams();
  if (options?.openSubRules) params.set("openSubRules", "1");
  if (options?.reviewSelectionLimits) params.set("reviewSelectionLimits", "1");
  navigate(
    `${routes.CATALOG_POLICY_DETAIL(response.data.id)}${
      params.size ? `?${params.toString()}` : ""
    }`,
  );
}
