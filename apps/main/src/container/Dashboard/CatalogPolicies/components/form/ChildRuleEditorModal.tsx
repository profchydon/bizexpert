"use client";

import { useState } from "react";
import { AlertTriangle, GitBranch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { CatalogRule } from "../../types";
import {
  getSubRuleConflictError,
  type SubRuleConflictError,
} from "../../subRuleConflictError";
import {
  isChildRuleReadyToSave,
  type ChildRuleDraft,
} from "../../utilsChildRule";
import {
  getChildRuleSubmitLabel,
  isChildRuleSubmitDisabled,
} from "../../utilsChildRuleModal";
import { ChildRuleEditorBody } from "./ChildRuleEditorBody";
import { ChildRuleStepper } from "./ChildRuleEditorFields";

export function ChildRuleEditorModal({
  open,
  initialDraft,
  parent,
  onClose,
  onSave,
  isEditing = false,
  isSaving = false,
}: {
  open: boolean;
  initialDraft: ChildRuleDraft;
  parent: CatalogRule;
  onClose: () => void;
  onSave: (
    draft: ChildRuleDraft,
    options?: { acknowledgeDisplacement?: boolean },
  ) => Promise<void> | void;
  isEditing?: boolean;
  isSaving?: boolean;
}) {
  const [working, setWorking] = useState(initialDraft);
  const [step, setStep] = useState<1 | 2>(1);
  const [conflictError, setConflictError] =
    useState<SubRuleConflictError | null>(null);
  const [conflictAcknowledged, setConflictAcknowledged] = useState(false);
  const canSave = isChildRuleReadyToSave(working, parent);
  const canContinue = working.name.trim().length > 0;
  const finalStep = step === 2;
  const needsConflictAcknowledgment =
    conflictError?.requiresAcknowledgment && !conflictAcknowledged;
  const updateWorking = (draft: ChildRuleDraft) => {
    setConflictError(null);
    setConflictAcknowledged(false);
    setWorking(draft);
  };

  async function handleSave() {
    try {
      await onSave(working, {
        acknowledgeDisplacement:
          conflictError?.requiresAcknowledgment && conflictAcknowledged,
      });
    } catch (error) {
      const parsedConflict = getSubRuleConflictError(error);
      if (!parsedConflict) throw error;
      setConflictError(parsedConflict);
      setConflictAcknowledged(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && !isSaving && onClose()}
      data-testid="childruleeditormodal-dialog"
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1020] bg-[#101828]/70 backdrop-blur-[2px]"
        className="z-[1021] max-h-[85dvh] w-[calc(100vw-3rem)] max-w-3xl overflow-hidden rounded-xl border-0 bg-white p-0 shadow-xl"
      >
        <div className="flex max-h-[85dvh] flex-col bg-white">
          <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 pb-5 pt-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-medium leading-7 text-gray-900">
                {isEditing ? "Update sub policy" : "Add sub policy"}
              </h2>
              <div className="inline-flex w-fit items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
                <GitBranch className="size-3.5 shrink-0 text-primary-600" />
                <span className="truncate">Inherits from {parent.name}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              disabled={isSaving}
              className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          </header>

          <div className="px-6 pb-4 pt-5">
            <ChildRuleStepper step={step} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-px">
            <ChildRuleEditorBody
              step={step}
              draft={working}
              parent={parent}
              onChange={updateWorking}
            />
            <SubRuleConflictBanner
              conflictError={conflictError}
              acknowledged={conflictAcknowledged}
              onAcknowledge={() => setConflictAcknowledged(true)}
            />
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-5">
            {step === 2 ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-gray-700"
                onClick={() => setStep(1)}
                disabled={isSaving}
                data-testid="childruleeditormodal-button"
              >
                Back
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-gray-700"
                onClick={onClose}
                disabled={isSaving}
                data-testid="childruleeditormodal-button-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-10 rounded-lg px-4 text-sm font-medium"
                disabled={isChildRuleSubmitDisabled({
                  canSave: canSave && !needsConflictAcknowledgment,
                  canContinue,
                  finalStep,
                  isSaving,
                })}
                onClick={() => {
                  if (!finalStep) {
                    setStep(2);
                    return;
                  }
                  if (canSave) void handleSave();
                }}
                data-testid="childruleeditormodal-button-3"
              >
                {getChildRuleSubmitLabel({ finalStep, isEditing, isSaving })}
              </Button>
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubRuleConflictBanner({
  conflictError,
  acknowledged,
  onAcknowledge,
}: {
  conflictError: SubRuleConflictError | null;
  acknowledged?: boolean;
  onAcknowledge?: () => void;
}) {
  if (!conflictError || acknowledged) return null;
  const isRed = !conflictError.requiresAcknowledgment;

  return (
    <div
      className={cn(
        "mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
        isRed
          ? "border-error-200 bg-error-50 text-error-700"
          : "border-warning-200 bg-warning-50 text-warning-700",
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-medium">Catalog rule conflicts detected.</p>
        {conflictError.messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
        {conflictError.requiresAcknowledgment ? (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={onAcknowledge}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Acknowledge
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
