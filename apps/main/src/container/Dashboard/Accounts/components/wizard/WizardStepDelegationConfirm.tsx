"use client";

import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  billingEntityOptionById,
  useBillingEntityOptions,
} from "../../hooks/useBillingEntityOptions";
import type { SubsidiaryDraft } from "../../types";

interface Props {
  draft: SubsidiaryDraft;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  showErrors: boolean;
}

export function WizardStepDelegationConfirm({
  draft,
  confirmed,
  onConfirmedChange,
  showErrors,
}: Props) {
  const { options: billingEntityOptions } = useBillingEntityOptions({
    filterByCountry: false,
  });
  const billingEntity = billingEntityOptionById(
    billingEntityOptions,
    draft.billingEntityId,
  );
  const confirmInvalid = showErrors && !confirmed;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">
          Billing delegation
        </p>
        <dl className="mt-3 grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">New entity</dt>
            <dd className="font-medium text-gray-900">{draft.name || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Billing entity</dt>
            <dd className="font-medium text-gray-900">
              {billingEntity?.label ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Currency</dt>
            <dd className="font-medium text-gray-900">
              {draft.currency ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-primary-700" />
        <p className="text-sm text-gray-600">
          The billing entity will be invoiced for this entity. Currency, tax
          jurisdiction, invoicing, and payment method are inherited and cannot
          be changed after creation.
        </p>
      </div>

      <div id="wf-confirm" className="flex items-start gap-3">
        <Checkbox
          id="delegation-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => onConfirmedChange(checked === true)}
          data-testid="wizardstepdelegationconfirm-checkbox"
        />
        <Label
          htmlFor="delegation-confirm"
          className="cursor-pointer text-sm font-normal leading-snug text-gray-700"
        >
          I confirm that billing will be delegated to{" "}
          {billingEntity?.label ?? "the selected entity"} and understand this
          cannot be changed later.
        </Label>
      </div>
      {confirmInvalid && (
        <p className="text-sm text-error-600">
          Confirm the billing delegation to continue.
        </p>
      )}
    </div>
  );
}
