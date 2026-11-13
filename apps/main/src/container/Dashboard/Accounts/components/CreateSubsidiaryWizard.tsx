"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardSetupReturnLoading } from "./CardSetupReturnLoading";
import { useCreateEntitySubmission } from "../hooks/useCreateEntitySubmission";
import { useResumeCreateEntityDone } from "../hooks/useResumeCreateEntityDone";
import { useSubsidiaryWizard } from "../hooks/useSubsidiaryWizard";
import { useOfficeAdminOptions } from "../Offices/hooks/useOfficeAdminOptions";
import type { CreateEntityReturnDone } from "../utils/entityCardSetupReturn";
import { WizardModalFooter } from "./wizard/WizardModalFooter";
import { WizardStepCardCapture } from "./wizard/WizardStepCardCapture";
import { WizardStepCurrencyLock } from "./wizard/WizardStepCurrencyLock";
import { WizardStepDelegationConfirm } from "./wizard/WizardStepDelegationConfirm";
import { WizardStepDetails } from "./wizard/WizardStepDetails";
import { WizardStepDone } from "./wizard/WizardStepDone";
import { WizardStepIndicator } from "./wizard/WizardStepIndicator";
import { CREATE_SUBSIDIARY_PRIMARY_LABEL } from "./createSubsidiaryWizardLabels";
import { trackSubsidiaryWizard } from "@/lib/subsidiaryWizardAnalytics";

export type { CreateEntityReturnDone };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (summary: { name: string; stalled: boolean }) => void;
  returnDone?: CreateEntityReturnDone | null;
  isResumingCardCapture?: boolean;
}

export function CreateSubsidiaryWizard({
  isOpen,
  onClose,
  onCreated,
  returnDone = null,
  isResumingCardCapture = false,
}: Props) {
  const wizard = useSubsidiaryWizard();
  const admins = useOfficeAdminOptions(!isOpen, undefined, {
    filterByCountry: false,
  });
  const { submitDelegatedEntity, submitSelfBillingEntity, isSubmitting } =
    useCreateEntitySubmission();
  const [showErrors, setShowErrors] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const [createdStalled, setCreatedStalled] = useState(false);

  const isResumeReady = useResumeCreateEntityDone(
    isOpen,
    returnDone,
    wizard,
    (state) => {
      setCreatedName(state.name);
      setCreatedStalled(state.stalled);
      setShowErrors(false);
    },
  );

  const isReturnLoading =
    isResumingCardCapture || (!!returnDone && isOpen && !isResumeReady);

  useEffect(() => {
    if (!isOpen || isReturnLoading) return;
    trackSubsidiaryWizard({ step: wizard.stepKey, status: "reached" });
  }, [isOpen, isReturnLoading, wizard.stepKey]);

  function handleClose() {
    onClose();
    wizard.reset();
    setShowErrors(false);
    setCreatedName(null);
    setCreatedStalled(false);
  }

  async function handleNext() {
    const invalidField = wizard.firstInvalidField();
    if (invalidField) {
      setShowErrors(true);
      document
        .getElementById(`wf-${invalidField}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setShowErrors(false);

    if (wizard.stepKey === "confirm") {
      const created = await submitDelegatedEntity(wizard.draft);
      if (!created) return;
      trackSubsidiaryWizard({ step: "confirm", status: "submitted" });
      setCreatedName(wizard.draft.name.trim());
      setCreatedStalled(false);
      wizard.goNext();
      return;
    }

    if (wizard.stepKey === "payment") {
      const result = await submitSelfBillingEntity(wizard.draft);
      if (!result || result.capture === "failed") return;
      trackSubsidiaryWizard({ step: "payment", status: "submitted" });
      return;
    }

    if (wizard.stepKey === "done") {
      if (createdName) {
        onCreated?.({ name: createdName, stalled: createdStalled });
      }
      handleClose();
      return;
    }

    trackSubsidiaryWizard({ step: wizard.stepKey, status: "completed" });
    wizard.goNext();
  }

  function handleBack() {
    setShowErrors(false);
    wizard.goBack();
  }

  const isDone = wizard.stepKey === "done";
  const primaryLabel =
    CREATE_SUBSIDIARY_PRIMARY_LABEL[wizard.stepKey] ?? "Next";
  const hint = wizard.advanceHint();
  const doneName = createdName ?? wizard.draft.name;
  const doneOutcome = createdStalled ? "stalled" : "success";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !open && !isSubmitting && !isReturnLoading && handleClose()
      }
      data-testid="createsubsidiarywizard-dialog"
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(90vh,840px)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-gray-200 p-0 shadow-xl sm:max-h-[min(85vh,840px)]"
      >
        <DialogHeader className="shrink-0 space-y-0 border-b border-gray-200 px-4 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 text-left">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Create entity
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Set up a legal company that bills independently from your
                Company.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isReturnLoading}
              aria-label="Close"
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="shrink-0 px-4 pt-5 pb-4 sm:px-6">
          <WizardStepIndicator
            steps={wizard.steps.map((step) => step.label)}
            currentStep={wizard.currentStep}
          />
        </div>

        <div className="max-h-[min(52vh,480px)] overflow-y-auto px-4 pb-6 sm:px-6">
          {isReturnLoading ? (
            <CardSetupReturnLoading
              message={
                isResumingCardCapture
                  ? "Confirming card capture…"
                  : "Opening card capture summary…"
              }
            />
          ) : (
            <>
              {wizard.stepKey === "details" && (
                <WizardStepDetails
                  draft={wizard.draft}
                  update={wizard.update}
                  setBillingMode={wizard.setBillingMode}
                  setBillingEntity={wizard.setBillingEntity}
                  showErrors={showErrors}
                  admins={admins}
                />
              )}
              {wizard.stepKey === "currency" && (
                <WizardStepCurrencyLock
                  currency={wizard.draft.currency}
                  confirmed={wizard.billingConfirmed}
                  onConfirmedChange={wizard.setBillingConfirmed}
                  showErrors={showErrors}
                />
              )}
              {wizard.stepKey === "confirm" && (
                <WizardStepDelegationConfirm
                  draft={wizard.draft}
                  confirmed={wizard.billingConfirmed}
                  onConfirmedChange={wizard.setBillingConfirmed}
                  showErrors={showErrors}
                />
              )}
              {wizard.stepKey === "payment" && (
                <WizardStepCardCapture
                  name={wizard.draft.name}
                  currency={wizard.draft.currency}
                />
              )}
              {wizard.stepKey === "done" && (
                <WizardStepDone name={doneName} outcome={doneOutcome} />
              )}
            </>
          )}
        </div>

        <WizardModalFooter
          isDone={isDone}
          showBack={!isDone && wizard.currentStep > 1 && !returnDone}
          hint={hint}
          primaryLabel={primaryLabel}
          isLoading={isSubmitting || isReturnLoading}
          onBack={handleBack}
          onClose={handleClose}
          onNext={handleNext}
        />
      </DialogContent>
    </Dialog>
  );
}
