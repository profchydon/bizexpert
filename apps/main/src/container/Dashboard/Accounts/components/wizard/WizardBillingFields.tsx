import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { useBillingEntityOptions } from "../../hooks/useBillingEntityOptions";
import type { BillingMode, SubsidiaryDraft } from "../../types";
import { wizardLabelClass } from "./wizardFieldClasses";
import { WizardRadioCard } from "./WizardRadioCard";
import { WizardSelectField } from "./WizardSelectField";
import { currencyOptions } from "../../data/wizardOptions";

interface Props {
  draft: SubsidiaryDraft;
  update: (patch: Partial<SubsidiaryDraft>) => void;
  setBillingMode: (mode: BillingMode) => void;
  setBillingEntity: (id: string | null) => void;
  showErrors: boolean;
}

export function WizardBillingFields({
  draft,
  update,
  setBillingMode,
  setBillingEntity,
  showErrors,
}: Props) {
  const billingEntityQuery = useBillingEntityOptions({
    filterByCountry: false,
  });
  const billingEntityOptions = billingEntityQuery.options;
  const isDelegated = draft.billingMode === "delegated";
  const entityInvalid = showErrors && isDelegated && !draft.billingEntityId;
  const currencyInvalid = showErrors && !isDelegated && !draft.currency;
  const billingEntityBlocked = billingEntityQuery.requiresCountry;
  const billingEntityPlaceholder = billingEntityBlocked
    ? "Select a country first"
    : billingEntityQuery.isLoading
      ? "Loading entities..."
      : billingEntityQuery.isError
        ? "Unable to load entities"
        : "Select the entity that will be billed";
  const billingEntityHint = billingEntityQuery.isError
    ? "Entities could not be loaded. Try again later."
    : !billingEntityBlocked &&
        !billingEntityQuery.isLoading &&
        billingEntityOptions.length === 0
      ? "No self-billing entities are available in this account yet."
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className={wizardLabelClass}>Billing responsibility</Label>
        <RadioGroup
          value={draft.billingMode}
          onValueChange={(value) => setBillingMode(value as BillingMode)}
          className="grid gap-3"
          data-testid="wizardbillingfields-radiogroup"
        >
          <WizardRadioCard
            value="self"
            selected={draft.billingMode === "self"}
            label="This entity bills itself"
            description="Picks its own currency and payment method."
          />
          <WizardRadioCard
            value="delegated"
            selected={draft.billingMode === "delegated"}
            label="Delegate billing to another entity"
            description="Another entity in the account pays. Currency and payment method are inherited."
          />
        </RadioGroup>
      </div>

      {isDelegated ? (
        <>
          <WizardSelectField
            id="wf-billingEntity"
            label="Billing entity"
            placeholder={billingEntityPlaceholder}
            value={draft.billingEntityId}
            onValueChange={(value) => setBillingEntity(value)}
            options={billingEntityOptions}
            invalid={entityInvalid}
            errorMessage="Select a billing entity."
            disabled={billingEntityBlocked || billingEntityQuery.isLoading}
            hint={billingEntityHint}
          />
          <div className="flex flex-col gap-1.5">
            <Label className={wizardLabelClass}>
              Billing currency (inherited)
            </Label>
            <div className="flex h-11 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
              {draft.currency ??
                "Select a billing entity to inherit its currency"}
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-primary-700" />
            <p className="text-sm text-gray-600">
              The billing entity will be billed for this entity. It inherits
              currency, tax jurisdiction, invoicing, and payment method. This is
              set at creation and cannot be changed later.
            </p>
          </div>
        </>
      ) : (
        <WizardSelectField
          id="wf-currency"
          label="Billing currency"
          placeholder="Select currency"
          value={draft.currency}
          onValueChange={(value) => update({ currency: value })}
          options={currencyOptions}
          invalid={currencyInvalid}
          errorMessage="Select a billing currency."
          hint="Independent of the parent Company. You will confirm and lock this next."
        />
      )}
    </div>
  );
}
