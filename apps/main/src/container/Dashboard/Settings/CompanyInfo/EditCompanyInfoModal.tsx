"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMPLOYEE_SIZE_OPTIONS,
  companyNameHint,
  phoneHint,
  websiteHint,
} from "./companyInfoValidation";

export interface CompanyInfoDraft {
  name: string;
  phone: string;
  website: string;
  size: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: CompanyInfoDraft;
  isSaving: boolean;
  onSave: (draft: CompanyInfoDraft) => void;
}

export function EditCompanyInfoModal({
  open,
  onOpenChange,
  initial,
  isSaving,
  onSave,
}: Props) {
  const [draft, setDraft] = useState(initial);
  const sizes = EMPLOYEE_SIZE_OPTIONS.includes(initial.size)
    ? EMPLOYEE_SIZE_OPTIONS
    : [initial.size, ...EMPLOYEE_SIZE_OPTIONS].filter(Boolean);

  useEffect(() => {
    if (!open) return;
    setDraft(initial);
  }, [open, initial.name, initial.phone, initial.website, initial.size]);

  const nameError = companyNameHint(draft.name);
  const phoneError =
    draft.phone === initial.phone ? undefined : phoneHint(draft.phone);
  const websiteError = websiteHint(draft.website);
  const canSave = !nameError && !phoneError && !websiteError && !isSaving;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="editcompanyinfomodal-dialog"
    >
      <DialogContent className="gap-0 rounded-2xl p-6 shadow-xl sm:rounded-2xl">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Pencil className="size-5" />
        </div>
        <DialogTitle className="mt-4 text-base font-semibold text-gray-900">
          Edit company details
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-gray-600">
          Update your company details. Date created, email address, address, and
          subscription plan stay locked.
        </DialogDescription>

        <div className="mt-5 flex flex-col gap-4">
          <Field label="Company name" error={nameError}>
            <Input
              value={draft.name}
              placeholder="e.g. Acme UK Ltd"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              data-testid="editcompanyinfomodal-input"
            />
          </Field>
          <Field label="Phone number" error={phoneError}>
            <PhoneInput
              value={draft.phone}
              onChange={(value) =>
                setDraft((current) => ({ ...current, phone: value ?? "" }))
              }
            />
          </Field>
          <Field label="Website" error={websiteError}>
            <Input
              value={draft.website}
              placeholder="e.g. acme.com"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  website: event.target.value,
                }))
              }
              data-testid="editcompanyinfomodal-input-2"
            />
          </Field>
          <Field label="Employees size">
            <Select
              value={draft.size || undefined}
              onValueChange={(size) =>
                setDraft((current) => ({ ...current, size }))
              }
              data-testid="editcompanyinfomodal-select"
            >
              <SelectTrigger aria-label="Employees size">
                <SelectValue placeholder="Select employees size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
            data-testid="editcompanyinfomodal-button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full"
            disabled={!canSave}
            isLoading={isSaving}
            onClick={() => onSave(draft)}
            data-testid="editcompanyinfomodal-button-2"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
      {error && <p className="text-sm text-error-600">{error}</p>}
    </div>
  );
}
