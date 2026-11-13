"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  kind: "employees" | "assets";
  count: number;
  targets: Office[];
  entityName?: string;
  isOpen: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: (destination: Office) => void;
}

export function ReassignOfficeModal({
  kind,
  count,
  targets,
  entityName,
  isOpen,
  isConfirming = false,
  onClose,
  onConfirm,
}: Props) {
  const [destId, setDestId] = useState<string>("");
  const noun = kind === "employees" ? "employee" : "asset";

  function handleClose() {
    onClose();
    setDestId("");
  }

  function handleConfirm() {
    const dest = targets.find((office) => office.id === destId);
    if (!dest) return;
    onConfirm(dest);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      data-testid="reassignofficemodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={Share2} color="brand" />
          <button
            type="button"
            className={editSubsidiaryModalCloseButtonClass}
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <DialogTitle className={editSubsidiaryModalTitleClass}>
          Reassign {count} {noun}
          {count === 1 ? "" : "s"}
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          Choose the office to move {count === 1 ? "this" : "these"} {noun}
          {count === 1 ? "" : "s"} to.{" "}
          {count === 1 && kind === "assets" ? "It" : "They"} will leave this
          office.
        </p>
        <div className={editSubsidiaryModalBodyClass}>
          {targets.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              There is no other active office under{" "}
              {entityName ?? "this entity"} to reassign to.{" "}
              {kind === "employees" ? "Employees" : "Assets"} can&apos;t move
              between entities yet, so create another office under this entity
              first.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Destination office
              </Label>
              <Select
                value={destId}
                onValueChange={setDestId}
                data-testid="reassignofficemodal-select"
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select an office" />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.name} · {office.subsidiaryName} · {office.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={editSubsidiaryFooterButtonClass}
            onClick={handleClose}
            data-testid="reassignofficemodal-button"
          >
            Cancel
          </Button>
          <Button
            className={editSubsidiaryFooterButtonClass}
            disabled={!destId}
            isLoading={isConfirming}
            onClick={handleConfirm}
            data-testid="reassignofficemodal-button-2"
          >
            Reassign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
