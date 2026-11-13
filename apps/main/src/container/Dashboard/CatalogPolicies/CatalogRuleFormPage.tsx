"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/createCatalogPolicy";
import { useGetCatalogPolicyQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicy";
import { useUpdateCatalogPolicyMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/updateCatalogPolicy";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  CompactKitSelectionSection,
  ConflictBanner,
  FormSection,
  NotFoundState,
  PolicyNameSection,
  RuleFormHeader,
  StorageOptionFields,
  SwapBehaviorFields,
  TriggerTypeFields,
} from "./components";
import { CriteriaFields } from "./components/wizard/CriteriaFields";
import { useOpenSelectionKitCategories } from "./components/wizard/useOpenSelectionKitCategories";
import { policyToRule, ruleToPolicyPayload } from "./apiAdapters";
import type { CatalogRule } from "./types";
import { calculateSpecificityScore, createDraftRule } from "./utils";
import routes from "@/routes";

export function CatalogRuleFormPage({ ruleId }: { ruleId?: string }) {
  const router = useRouter();
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const { data: policyRes, isLoading } = useGetCatalogPolicyQuery(
    { companyId: companyId!, catalogId: ruleId! },
    { skip: !companyId || !ruleId },
  );
  const existing = policyRes?.data ? policyToRule(policyRes.data) : undefined;
  const [draft, setDraft] = useState(() => createDraftRule());
  const [nameError, setNameError] = useState(false);
  const [amberAcknowledged, setAmberAcknowledged] = useState(false);
  const [createPolicy] = useCreateCatalogPolicyMutation();
  const [updatePolicy] = useUpdateCatalogPolicyMutation();

  const isEdit = Boolean(ruleId);

  useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing?.id]);

  const currentRule = {
    ...draft,
    specificityScore: calculateSpecificityScore(draft),
    updatedAt: new Date().toISOString(),
  };
  const kitCategories = useOpenSelectionKitCategories({
    companyId: companyId,
    draft: currentRule,
    enabled: !isEdit,
  });

  const conflicts = useMemo(() => [], []);
  const saveDisabled = !currentRule.name.trim() || kitCategories.isLoading;

  if (isEdit && !isLoading && !existing) {
    return <NotFoundState />;
  }

  async function handleSave() {
    if (!currentRule.name.trim()) {
      setNameError(true);
      return;
    }
    if (saveDisabled) return;

    if (isEdit && ruleId) {
      await updatePolicy({
        companyId: companyId!,
        catalogId: ruleId,
        payload: ruleToPolicyPayload(currentRule, { currentUserId: user?.id }),
      }).unwrap();
      router.push(routes.CATALOG_POLICY_DETAIL(ruleId));
      return;
    }

    const response = await createPolicy({
      companyId: companyId!,
      payload: ruleToPolicyPayload(currentRule, {
        currentUserId: user?.id,
        forceRuleActive: true,
        selectionCategoryIds: kitCategories.categoryIds,
      }),
    }).unwrap();
    router.push(routes.CATALOG_POLICY_DETAIL(response.data.id));
  }

  return (
    <>
      <RuleFormHeader
        rule={currentRule}
        isEdit={isEdit}
        ruleId={ruleId}
        onSave={handleSave}
        saveDisabled={saveDisabled}
      />
      <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 py-8">
        <FormSection>
          <PolicyNameSection
            name={currentRule.name}
            nameError={nameError}
            onNameChange={(name) => {
              setDraft({ ...currentRule, name });
              setNameError(false);
            }}
          />
        </FormSection>
        <FormSection>
          <CriteriaFields draft={currentRule} onChange={setDraft} />
        </FormSection>
        <FormSection>
          <CompactKitSelectionSection
            selectedKitIds={currentRule.kitIds}
            onKitsChange={(kitIds) => setDraft({ ...currentRule, kitIds })}
          />
        </FormSection>
        <FormSection>
          <TriggerTypeFields
            triggerType={currentRule.triggerType}
            onChange={(triggerType) =>
              setDraft({ ...currentRule, triggerType })
            }
          />
        </FormSection>
        <FormSection>
          <SwapBehaviorFields
            allowItemSwap={currentRule.allowItemSwap}
            onChange={(allowItemSwap) =>
              setDraft({ ...currentRule, allowItemSwap })
            }
          />
        </FormSection>
        <FormSection>
          <StorageOptionFields
            includeStorage={currentRule.includeCompanyStorage}
            onStorageChange={(includeCompanyStorage) =>
              setDraft({ ...currentRule, includeCompanyStorage })
            }
          />
        </FormSection>
        <ConflictBanner
          conflicts={conflicts}
          acknowledged={amberAcknowledged}
          onAcknowledge={() => setAmberAcknowledged(true)}
        />
      </main>
    </>
  );
}
