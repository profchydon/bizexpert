"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PreFlightCheck, Subsidiary } from "../types";
import { useActingAdmin } from "../hooks/useAccountsData";
import { useAccountsFixtureValues } from "../hooks/useAccountsFixtures";
import {
  buildCloseSubsidiaryChecksFromFixture,
  canCloseSubsidiary,
  confirmSlugMatches,
  toConfirmSlug,
} from "../utils/preflightChecks";
import { ClosePreflightModalShell } from "./ClosePreflightModalShell";
import { ConfirmNameField } from "./ConfirmNameField";
import { PreFlightCheckList } from "./PreFlightCheckList";

interface Props {
  subsidiary: Subsidiary | null;
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  closeChecks?: PreFlightCheck[] | null;
}

const ENTITY_DESCRIPTION =
  "Closing stops this entity's billing permanently. We'll run these pre-flight checks first. Nothing is deleted.";

export function CloseSubsidiaryModal({
  subsidiary,
  isOpen,
  isClosing = false,
  onClose,
  onConfirm,
  closeChecks = null,
}: Props) {
  const { closureBlockers } = useAccountsFixtureValues();
  const acting = useActingAdmin();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!isOpen) setTyped("");
  }, [isOpen]);

  const checks = useMemo(() => {
    if (closeChecks?.length) return closeChecks;
    return buildCloseSubsidiaryChecksFromFixture(
      subsidiary,
      acting,
      closureBlockers,
    );
  }, [acting, closeChecks, closureBlockers, subsidiary]);
  const canClose = canCloseSubsidiary(checks);
  const confirmSlug = toConfirmSlug(subsidiary?.name ?? "");
  const nameMatches = confirmSlugMatches(typed, confirmSlug);

  return (
    <ClosePreflightModalShell
      isOpen={isOpen}
      onClose={onClose}
      subjectName={subsidiary?.name ?? "entity"}
      description={ENTITY_DESCRIPTION}
      testId="closesubsidiarymodal-dialog"
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={onClose}
            data-testid="closesubsidiarymodal-button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className="w-full"
            disabled={!(canClose && nameMatches)}
            isLoading={isClosing}
            onClick={onConfirm}
            data-testid="closesubsidiarymodal-button-2"
          >
            Close entity
          </Button>
        </>
      }
    >
      <PreFlightCheckList checks={checks} />
      {canClose && (
        <ConfirmNameField
          confirmSlug={confirmSlug}
          value={typed}
          onChange={setTyped}
        />
      )}
    </ClosePreflightModalShell>
  );
}
