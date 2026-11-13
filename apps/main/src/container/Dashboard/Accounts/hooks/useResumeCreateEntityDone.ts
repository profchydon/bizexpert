"use client";

import { useLayoutEffect, useState } from "react";
import type { CreateEntityReturnDone } from "../utils/entityCardSetupReturn";
import type { useSubsidiaryWizard } from "./useSubsidiaryWizard";

export function useResumeCreateEntityDone(
  isOpen: boolean,
  returnDone: CreateEntityReturnDone | null,
  wizard: ReturnType<typeof useSubsidiaryWizard>,
  apply: (state: CreateEntityReturnDone) => void,
) {
  const [isReady, setIsReady] = useState(() => !returnDone);

  useLayoutEffect(() => {
    if (!isOpen || !returnDone) {
      setIsReady(!returnDone);
      return;
    }

    wizard.update({ name: returnDone.name, billingMode: "self" });
    wizard.goToDone();
    apply(returnDone);
    setIsReady(true);
  }, [isOpen, returnDone]);

  return isReady;
}
