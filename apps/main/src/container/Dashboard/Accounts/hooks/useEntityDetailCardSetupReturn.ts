"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useConfirmEntityConsentMutation } from "@/api/baseQueries/companiesApi/entitiesApi/confirmEntityConsent";
import {
  clearPendingEntityCreate,
  peekPendingEntityCreate,
  readEntityCardSetupStatus,
} from "../utils/entityCardSetupReturn";
import { confirmEntityCardSetupReturn } from "../utils/confirmEntityCardSetupReturn";

export function useEntityDetailCardSetupReturn(entityId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmConsent] = useConfirmEntityConsentMutation();
  const [isResumingCardCapture, setIsResumingCardCapture] = useState(
    () => readEntityCardSetupStatus(searchParams.get("card_setup")) !== null,
  );
  const processedRef = useRef(false);

  const clearCardSetupQuery = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("card_setup");
    const query = nextParams.toString();
    const basePath = window.location.pathname;
    const nextUrl = query ? `${basePath}?${query}` : basePath;
    window.history.replaceState(null, "", nextUrl);
    router.replace(nextUrl);
  }, [router, searchParams]);

  useEffect(() => {
    const status = readEntityCardSetupStatus(searchParams.get("card_setup"));
    if (!status || processedRef.current) return;

    processedRef.current = true;

    async function handleReturn() {
      const pending = peekPendingEntityCreate();

      try {
        if (status === "success") {
          const ok = await confirmEntityCardSetupReturn({
            entityId,
            sessionId: pending?.sessionId,
            confirmConsent,
          });
          clearCardSetupQuery();
          if (ok) {
            toast.success(
              "Card capture complete. This entity is now operational.",
            );
          } else {
            toast.error(
              "Card capture could not be confirmed yet. Try again from this page.",
            );
          }
          return;
        }

        clearCardSetupQuery();
        toast.warning("Card capture was cancelled. You can retry when ready.");
      } finally {
        clearPendingEntityCreate();
        setIsResumingCardCapture(false);
      }
    }

    void handleReturn();
  }, [clearCardSetupQuery, confirmConsent, entityId, searchParams]);

  return { isResumingCardCapture };
}
