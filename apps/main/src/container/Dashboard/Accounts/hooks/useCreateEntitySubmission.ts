"use client";

import { useCreateEntityMutation } from "@/api/baseQueries/companiesApi/entitiesApi/createEntity";
import { toast } from "sonner";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import routes from "@/routes";
import type { SubsidiaryDraft } from "../types";
import { buildCreateEntityPayload } from "../utils/buildCreateEntityPayload";
import type { EntityCardCaptureOutcome } from "./useEntityCardCapture";
import { useEntityCardCapture } from "./useEntityCardCapture";

export type SelfBillingEntityResult = {
  entityId: string;
  name: string;
  capture: EntityCardCaptureOutcome;
};

export function useCreateEntitySubmission() {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = getCompanyDetails()?.id;
  const [createEntity, createState] = useCreateEntityMutation();
  const { beginCardCapture, isCapturing } = useEntityCardCapture();

  async function submitDelegatedEntity(draft: SubsidiaryDraft) {
    if (!companyId) {
      toast.error("Company details are unavailable.");
      return null;
    }

    try {
      const response = await createEntity({
        companyId,
        body: buildCreateEntityPayload(draft),
      }).unwrap();
      return response.data;
    } catch {
      toast.error("Could not create the entity. Try again.");
      return null;
    }
  }

  async function submitSelfBillingEntity(
    draft: SubsidiaryDraft,
  ): Promise<SelfBillingEntityResult | null> {
    if (!companyId) {
      toast.error("Company details are unavailable.");
      return null;
    }

    try {
      const response = await createEntity({
        companyId,
        body: buildCreateEntityPayload(draft),
      }).unwrap();
      const name = draft.name.trim();
      const capture = await beginCardCapture({
        entityId: response.data.id,
        name,
        returnPath: routes.ACCOUNTS,
      });

      if (capture === "failed") {
        return null;
      }

      return {
        entityId: response.data.id,
        name,
        capture,
      };
    } catch {
      toast.error("Could not create the entity. Try again.");
      return null;
    }
  }

  return {
    submitDelegatedEntity,
    submitSelfBillingEntity,
    isSubmitting: createState.isLoading || isCapturing,
  };
}
