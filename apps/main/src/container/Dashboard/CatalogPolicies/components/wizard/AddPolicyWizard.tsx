"use client";

import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import type { CatalogRule } from "../../types";
import {
  calculateSpecificityScore,
  createDraftRule,
  needsMultiKitFixedWarning,
} from "../../utils";
import { CriteriaFields } from "./CriteriaFields";
import { WizardFooter } from "./Footer";
import { WizardBasics } from "./BasicsStep";
import { WizardHeader } from "./Header";
import { WizardKitStorage } from "./KitStorageStep";
import { MultiKitFixedWarningModal } from "./MultiKitFixedWarningModal";
import { WizardStepper } from "./Stepper";
import { useCreatePolicyConflictCheck } from "./useCreatePolicyConflictCheck";
import { useOpenSelectionKitCategories } from "./useOpenSelectionKitCategories";
import type { CreatePolicyOptions } from "./AddPolicyWizard.types";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  canContinuePolicyWizard,
  getPolicyWizardHint,
} from "./wizardValidation";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

export function AddPolicyWizard({
  open,
  companyId,
  conflictCatalogId,
  onClose,
  onCreate,
  isCreating = false,
}: {
  open: boolean;
  companyId?: string;
  currentUserId?: string;
  conflictCatalogId?: string;
  onClose: () => void;
  onCreate: (
    rule: CatalogRule,
    options?: CreatePolicyOptions,
  ) => void | Promise<void>;
  isCreating?: boolean;
}) {
  const workspaceCompanyId = useWorkspaceCompanyId();
  const currencySymbol = useWorkspaceCurrencySymbol();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CatalogRule>(() => createDraftRule());
  const [nameError, setNameError] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const currentDraft = {
    ...draft,
    specificityScore: calculateSpecificityScore(draft),
  };
  const isLastStep = step === 3;
  const hasRequiredApprovers = true;
  const baseCanProceed = canContinuePolicyWizard({
    draft,
    hasRequiredApprovers,
    step,
  });
  const conflicts = useCreatePolicyConflictCheck({
    catalogId: conflictCatalogId,
    companyId,
    draft: currentDraft,
    enabled: open && step === 3,
  });
  const kitCategories = useOpenSelectionKitCategories({
    companyId,
    draft: currentDraft,
    enabled: open && step === 3,
  });
  const canProceed =
    baseCanProceed &&
    !kitCategories.isLoading &&
    !(step === 3 && (conflicts.isBlocked || conflicts.isChecking));
  const hint = kitCategories.isLoading
    ? "Loading selected kit categories..."
    : getPolicyWizardHint({
        baseCanProceed,
        draft,
        hasRequiredApprovers,
        isConflictBlocked: conflicts.isBlocked,
        isCheckingConflicts: conflicts.isChecking,
        requiresConflictAcknowledgment: conflicts.requiresAcknowledgment,
        step,
      });

  function close() {
    if (isCreating) return;
    onClose();
    setStep(1);
    setDraft(createDraftRule());
    setNameError(false);
    setWarningOpen(false);
  }

  async function createPolicy(options?: CreatePolicyOptions) {
    try {
      await onCreate(createDraftRule({ ...draft, name: draft.name.trim() }), {
        ...options,
        acknowledgeDisplacement: conflicts.acknowledgeDisplacement,
        selectionCategoryIds: kitCategories.categoryIds,
      });
      close();
    } catch {
      return;
    }
  }

  async function next() {
    if (isCreating) return;
    if (!canProceed) {
      setNameError(true);
      return;
    }
    if (isLastStep) {
      if (needsMultiKitFixedWarning(draft)) {
        setWarningOpen(true);
        return;
      }
      if (draft.selectionMode === "OPEN" && draft.kitIds.length > 1) {
        await createPolicy({ reviewSelectionLimits: true });
        return;
      }
      await createPolicy();
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => (nextOpen ? null : close())}
        data-testid="addpolicywizard-dialog"
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border-0 p-0 shadow-xl sm:rounded-2xl"
        >
          <div className="flex max-h-[85vh] w-full flex-col bg-white">
            <WizardHeader isCreating={isCreating} onClose={close} />
            <div className="px-6 pb-4 pt-5">
              <WizardStepper step={step} />
            </div>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6">
              {step === 1 ? (
                <WizardBasics
                  draft={draft}
                  nameError={nameError}
                  onChange={(nextDraft) => {
                    setDraft(nextDraft);
                    setNameError(false);
                  }}
                />
              ) : step === 2 ? (
                <CriteriaFields draft={currentDraft} onChange={setDraft} />
              ) : (
                <WizardKitStorage
                  conflicts={conflicts}
                  draft={currentDraft}
                  currencySymbol={currencySymbol}
                  onChange={setDraft}
                />
              )}
            </div>
            <WizardFooter
              step={step}
              hint={hint}
              canProceed={canProceed}
              isLastStep={isLastStep}
              isSubmitting={isCreating}
              onBack={() => setStep((current) => current - 1)}
              onClose={close}
              onNext={next}
            />
          </div>
        </DialogContent>
      </Dialog>
      <MultiKitFixedWarningModal
        open={warningOpen}
        kitIds={draft.kitIds}
        onClose={() => setWarningOpen(false)}
        isCreating={isCreating}
        onContinue={() => createPolicy()}
        onCreateSubRule={() => createPolicy({ openSubRules: true })}
      />
    </>
  );
}
