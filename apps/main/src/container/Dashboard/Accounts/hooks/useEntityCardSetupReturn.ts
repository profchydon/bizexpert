"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useConfirmEntityConsentMutation } from "@/api/baseQueries/companiesApi/entitiesApi/confirmEntityConsent";
import routes from "@/routes";
import {
  type CreateEntityReturnDone,
  type EntityCardSetupStatus,
  clearPendingEntityCreate,
  mapCardSetupToDoneState,
  peekPendingEntityCreate,
  readEntityCardSetupStatus,
} from "../utils/entityCardSetupReturn";
import { confirmEntityCardSetupReturn } from "../utils/confirmEntityCardSetupReturn";

export function useEntityCardSetupReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmConsent] = useConfirmEntityConsentMutation();
  const [returnDone, setReturnDone] = useState<CreateEntityReturnDone | null>(
    null,
  );
  const [isResumingCardCapture, setIsResumingCardCapture] = useState(
    () => readEntityCardSetupStatus(searchParams.get("card_setup")) !== null,
  );

  useEffect(() => {
    const cardSetupStatus = readEntityCardSetupStatus(
      searchParams.get("card_setup"),
    );
    if (!cardSetupStatus) return;

    let active = true;

    async function handleReturn(resolvedStatus: EntityCardSetupStatus) {
      const pending = peekPendingEntityCreate();
      let doneState = mapCardSetupToDoneState(pending, resolvedStatus);

      if (resolvedStatus === "success" && pending?.entityId) {
        const ok = await confirmEntityCardSetupReturn({
          entityId: pending.entityId,
          sessionId: pending.sessionId,
          confirmConsent,
        });
        if (!ok) {
          toast.error(
            "Card capture could not be confirmed yet. You can retry from the entity page.",
          );
          if (doneState) {
            doneState = { ...doneState, stalled: true };
          }
        }
      }

      if (!active) return;

      if (doneState) {
        setReturnDone(doneState);
      }

      clearPendingEntityCreate();
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("card_setup");
      const query = nextParams.toString();
      router.replace(query ? `${routes.ACCOUNTS}?${query}` : routes.ACCOUNTS);
      setIsResumingCardCapture(false);
    }

    void handleReturn(cardSetupStatus);

    return () => {
      active = false;
    };
  }, [confirmConsent, router, searchParams]);

  const clearReturnDone = useCallback(() => {
    setReturnDone(null);
    setIsResumingCardCapture(false);
  }, []);

  return { returnDone, clearReturnDone, isResumingCardCapture };
}
