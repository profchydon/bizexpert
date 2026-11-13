"use client";

import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Subsidiary } from "../types";
import { EditCardOnFileField } from "./EditCardOnFileField";
import {
  editDelegatedPaymentNoticeClass,
  editSubsidiaryFieldInputClass,
  editSubsidiaryFieldLabelClass,
  editSubsidiaryFooterButtonClass,
  editSubsidiaryFooterClass,
  editSubsidiaryModalBodyClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "./editSubsidiaryModalClasses";

export type EntityEditFormValues = {
  name: string;
};

interface Props {
  subsidiary: Subsidiary | null;
  isOpen: boolean;
  isSaving?: boolean;
  isReplacingCard?: boolean;
  onClose: () => void;
  onSave: (values: EntityEditFormValues) => void;
  onReplaceCard?: () => void | Promise<void>;
}

export function EditSubsidiaryModal({
  subsidiary,
  isOpen,
  isSaving = false,
  isReplacingCard = false,
  onClose,
  onSave,
  onReplaceCard,
}: Props) {
  const [name, setName] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!isOpen || !subsidiary) return;
    setName(subsidiary.name);
    setShowErrors(false);
  }, [isOpen, subsidiary]);

  const canManageCard = subsidiary?.billingMode === "self";
  const isPrimary = Boolean(subsidiary?.isPrimary);
  const nameInvalid = showErrors && !name.trim();
  const canSave = !isPrimary && name.trim().length > 0;

  function handleSave() {
    if (isPrimary || !name.trim()) {
      setShowErrors(true);
      return;
    }
    onSave({ name: name.trim() });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      data-testid="editsubsidiarymodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Edit {subsidiary?.name ?? "entity"}
        </DialogTitle>
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={Pencil} size="md" color="brand" theme="light" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={editSubsidiaryModalCloseButtonClass}
          >
            <X className="size-5" />
          </button>
        </div>
        <h3 className={editSubsidiaryModalTitleClass}>
          Edit {subsidiary?.name ?? "entity"}
        </h3>
        <p className={editSubsidiaryModalDescriptionClass}>
          {isPrimary
            ? "Update the card on file. The name, currency, and billing mode stay locked."
            : "Update the entity name and card on file. Currency and billing mode stay locked."}
        </p>

        <div className={editSubsidiaryModalBodyClass}>
          {!isPrimary && (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-entity-name"
                className={editSubsidiaryFieldLabelClass}
              >
                Entity name
              </Label>
              <Input
                id="edit-entity-name"
                placeholder="e.g. Acme UK Ltd"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={
                  nameInvalid
                    ? `${editSubsidiaryFieldInputClass} border-error-500`
                    : editSubsidiaryFieldInputClass
                }
                data-testid="editsubsidiarymodal-input"
              />
              {nameInvalid && (
                <p className="text-sm text-error-600">Enter an entity name.</p>
              )}
            </div>
          )}
          {canManageCard ? (
            <EditCardOnFileField
              cardOnFile={subsidiary?.cardOnFile ?? false}
              isUpdating={isReplacingCard}
              onUpdate={() => void onReplaceCard?.()}
            />
          ) : (
            <p className={editDelegatedPaymentNoticeClass}>
              Payment is covered by {subsidiary?.billingEntityName}. There is no
              separate card to manage here.
            </p>
          )}
        </div>

        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={editSubsidiaryFooterButtonClass}
            onClick={onClose}
            disabled={isReplacingCard}
            data-testid="editsubsidiarymodal-button"
          >
            Cancel
          </Button>
          <Button
            className={editSubsidiaryFooterButtonClass}
            disabled={!canSave || isReplacingCard}
            isLoading={isSaving}
            onClick={handleSave}
            data-testid="editsubsidiarymodal-button-2"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
