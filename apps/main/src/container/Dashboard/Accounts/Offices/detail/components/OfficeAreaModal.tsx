"use client";

import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Office } from "../../../types";
import {
  editSubsidiaryFooterButtonClass,
  editSubsidiaryFooterClass,
  editSubsidiaryModalBodyClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "../../../components/editSubsidiaryModalClasses";

interface Props {
  isOpen: boolean;
  mode: "add" | "rename";
  current?: string;
  existing: string[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function OfficeAreaModal({
  isOpen,
  mode,
  current,
  existing,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName(mode === "rename" ? (current ?? "") : "");
  }, [current, isOpen, mode]);

  const trimmed = name.trim();
  const duplicate = existing.some(
    (entry) =>
      entry.toLowerCase() === trimmed.toLowerCase() && entry !== current,
  );
  const invalid = !trimmed || duplicate;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="officeareamodal-dialog"
    >
      <DialogContent
        className="max-w-md gap-0 rounded-2xl border-0 bg-white p-6 shadow-xl"
        showCloseButton={false}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={MapPin} color="brand" />
          <button
            type="button"
            className={editSubsidiaryModalCloseButtonClass}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <DialogTitle className={editSubsidiaryModalTitleClass}>
          {mode === "add" ? "Add office area" : "Rename area"}
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          {mode === "add"
            ? "Name an area inside this office where assets can sit, like Reception or Server room."
            : "Assets currently at this area move to the new name."}
        </p>
        <div className={editSubsidiaryModalBodyClass}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Area name
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Reception"
              className="rounded-lg"
              data-testid="officeareamodal-input"
            />
            {duplicate && (
              <p className="text-xs text-error-600">
                An area with this name already exists.
              </p>
            )}
          </div>
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={editSubsidiaryFooterButtonClass}
            onClick={onClose}
            data-testid="officeareamodal-button"
          >
            Cancel
          </Button>
          <Button
            className={editSubsidiaryFooterButtonClass}
            disabled={invalid}
            isLoading={isSubmitting}
            onClick={() => onSubmit(trimmed)}
            data-testid="officeareamodal-button-2"
          >
            {mode === "add" ? "Add area" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
