"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Office } from "../../types";
import {
  buildCloseOfficeChecks,
  canCloseOffice,
} from "../../utils/preflightChecks";
import {
  useOfficeAssetsPage,
  useOfficeEmployeesPage,
} from "../hooks/useOfficeMembersServer";
import { ClosePreflightModalShell } from "../../components/ClosePreflightModalShell";
import { PreFlightCheckList } from "../../components/PreFlightCheckList";

interface Props {
  office: Office | null;
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OFFICE_DESCRIPTION =
  "Closing an office is only allowed once it's empty. We'll check these first. Nothing is deleted; the office stays in your list as closed.";

export function CloseOfficeModal({
  office,
  isOpen,
  isClosing = false,
  onClose,
  onConfirm,
}: Props) {
  const officeId = office?.id ?? "";
  const employeesPage = useOfficeEmployeesPage(officeId, 1);
  const assetsPage = useOfficeAssetsPage(officeId, 1, office?.currency ?? "");
  const isCounting = employeesPage.isLoading || assetsPage.isLoading;
  const checks = useMemo(
    () => buildCloseOfficeChecks(employeesPage.total, assetsPage.total),
    [assetsPage.total, employeesPage.total],
  );
  const canClose = !isCounting && canCloseOffice(checks);

  return (
    <ClosePreflightModalShell
      isOpen={isOpen}
      onClose={onClose}
      subjectName={office?.name ?? "office"}
      description={OFFICE_DESCRIPTION}
      testId="closeofficemodal-dialog"
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={onClose}
            data-testid="closeofficemodal-button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className="w-full"
            disabled={!canClose}
            isLoading={isClosing}
            onClick={onConfirm}
            data-testid="closeofficemodal-button-2"
          >
            Close office
          </Button>
        </>
      }
    >
      <PreFlightCheckList checks={checks} />
    </ClosePreflightModalShell>
  );
}
