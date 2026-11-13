import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OfficeAdminDirectory } from "../../Offices/hooks/useOfficeAdminOptions";
import { OfficeAdminPicker } from "../../Offices/wizard/OfficeAdminPicker";
import type { BillingMode, SubsidiaryDraft } from "../../types";
import { WizardBillingFields } from "./WizardBillingFields";
import { WizardCountryField } from "./WizardCountryField";
import { wizardLabelClass } from "./wizardFieldClasses";

interface Props {
  draft: SubsidiaryDraft;
  update: (patch: Partial<SubsidiaryDraft>) => void;
  setBillingMode: (mode: BillingMode) => void;
  setBillingEntity: (id: string | null) => void;
  showErrors: boolean;
  admins: OfficeAdminDirectory;
}

export function WizardStepDetails({
  draft,
  update,
  setBillingMode,
  setBillingEntity,
  showErrors,
  admins,
}: Props) {
  const nameInvalid = showErrors && !draft.name.trim();
  const emailInvalid = showErrors && !draft.email.trim();
  const regionInvalid = showErrors && !draft.region;
  const adminInvalid = showErrors && draft.adminUserIds.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div id="wf-name" className="flex flex-col gap-1.5">
        <Label htmlFor="entity-name" className={wizardLabelClass}>
          Entity name
        </Label>
        <Input
          id="entity-name"
          placeholder="e.g. Acme UK Ltd"
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
          className={nameInvalid ? "border-error-500" : ""}
          data-testid="wizardstepdetails-input"
        />
        {nameInvalid && (
          <p className="text-sm text-error-600">Enter an entity name.</p>
        )}
      </div>

      <div id="wf-email" className="flex flex-col gap-1.5">
        <Label htmlFor="entity-email" className={wizardLabelClass}>
          Contact email
        </Label>
        <Input
          id="entity-email"
          type="email"
          placeholder="e.g. acme-uk@mailinator.com"
          value={draft.email}
          onChange={(event) => update({ email: event.target.value })}
          className={emailInvalid ? "border-error-500" : ""}
          data-testid="wizardstepdetails-input-2"
        />
        {emailInvalid && (
          <p className="text-sm text-error-600">Enter a contact email.</p>
        )}
      </div>

      <WizardCountryField
        id="wf-region"
        value={draft.region}
        onValueChange={(value) =>
          update({
            region: value,
            billingEntityId:
              draft.billingMode === "delegated" ? null : draft.billingEntityId,
            currency: draft.billingMode === "delegated" ? null : draft.currency,
          })
        }
        invalid={regionInvalid}
        errorMessage="Select a country."
      />

      <OfficeAdminPicker
        id="wf-admins"
        value={draft.adminUserIds}
        onChange={(adminUserIds) => update({ adminUserIds })}
        invalid={adminInvalid}
        options={admins.options}
        onQueryChange={admins.setQuery}
        hasMore={admins.hasMore}
        onLoadMore={admins.loadMore}
        isLoadingMore={admins.isFetching}
      />

      <WizardBillingFields
        draft={draft}
        update={update}
        setBillingMode={setBillingMode}
        setBillingEntity={setBillingEntity}
        showErrors={showErrors}
      />
    </div>
  );
}
