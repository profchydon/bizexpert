"use client";

import { useCallback, useState } from "react";
import type { StartEntityConsentData } from "@/api/baseQueries/companiesApi/entitiesApi/startEntityConsent";
import { useReplaceEntityConsentMutation } from "@/api/baseQueries/companiesApi/entitiesApi/replaceEntityConsent";
import { useStartEntityConsentMutation } from "@/api/baseQueries/companiesApi/entitiesApi/startEntityConsent";
import { resolveEntityCardCaptureUrl } from "@/api/baseQueries/companiesApi/entitiesApi/resolveEntityCardCapture";
import { toast } from "sonner";
import { stashPendingEntityCreate } from "../utils/entityCardSetupReturn";

export type EntityCardCaptureOutcome = "redirect" | "failed";

type CardCaptureInput = {
  entityId: string;
  name: string;
  returnPath: string;
};

export function useEntityCardCapture() {
  const [startConsent, startState] = useStartEntityConsentMutation();
  const [replaceConsent, replaceState] = useReplaceEntityConsentMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const redirectToConsent = useCallback(
    (
      consentResponse: StartEntityConsentData | undefined,
      input: CardCaptureInput,
    ): EntityCardCaptureOutcome => {
      const consent = consentResponse?.consent;
      const url = resolveEntityCardCaptureUrl(consent);

      if (!url) {
        setIsRedirecting(false);
        return "failed";
      }

      stashPendingEntityCreate({
        name: input.name.trim(),
        entityId: input.entityId,
        sessionId: consent?.session_id ?? null,
      });
      window.location.assign(url);
      return "redirect";
    },
    [],
  );

  const beginCardCapture = useCallback(
    async (input: CardCaptureInput): Promise<EntityCardCaptureOutcome> => {
      setIsRedirecting(true);

      try {
        const response = await startConsent({
          entityId: input.entityId,
          body: { return_path: input.returnPath },
        }).unwrap();

        const outcome = redirectToConsent(response.data, input);
        if (outcome === "failed") {
          toast.error("Card capture could not be started.");
        }
        return outcome;
      } catch {
        setIsRedirecting(false);
        toast.error("Card capture could not be started.");
        return "failed";
      }
    },
    [redirectToConsent, startConsent],
  );

  const beginCardReplace = useCallback(
    async (input: CardCaptureInput): Promise<EntityCardCaptureOutcome> => {
      setIsRedirecting(true);

      try {
        const response = await replaceConsent({
          entityId: input.entityId,
          body: { return_path: input.returnPath },
        }).unwrap();

        const outcome = redirectToConsent(response.data, input);
        if (outcome === "failed") {
          toast.error("Card replacement could not be started.");
        }
        return outcome;
      } catch {
        setIsRedirecting(false);
        toast.error("Card replacement could not be started.");
        return "failed";
      }
    },
    [redirectToConsent, replaceConsent],
  );

  const isCapturing =
    startState.isLoading || replaceState.isLoading || isRedirecting;

  return {
    beginCardCapture,
    beginCardReplace,
    isStarting: startState.isLoading,
    isReplacing: replaceState.isLoading,
    isRedirecting,
    isCapturing,
  };
}
