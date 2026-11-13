"use client";

import { Label } from "@/components/ui/label";
import type { OfficeDraft, OfficeParent } from "../../types";
import type { OfficeAdminDirectory } from "../hooks/useOfficeAdminOptions";
import { OfficeAdminPicker } from "./OfficeAdminPicker";
import { OfficeLimitNotice } from "./OfficeLimitNotice";
import { OfficeBasicsFields } from "./OfficeBasicsFields";
import {
  WizardSelectField,
  type WizardSelectOption,
} from "../../components/wizard/WizardSelectField";
import { wizardLabelClass } from "../../components/wizard/wizardFieldClasses";
import { isWorkspaceOwnEntity } from "./buildCreateOfficePayload";

interface Props {
  draft: OfficeDraft;
  update: (patch: Partial<OfficeDraft>) => void;
  parentOptions: OfficeParent[];
  admins: OfficeAdminDirectory;
  fixedParentId?: string;
  showErrors: boolean;
  atLimit: boolean;
  limit: number;
  hasMoreParents?: boolean;
  isLoadingMoreParents?: boolean;
  onLoadMoreParents?: () => void;
  parentSearch?: string;
  onParentSearchChange?: (value: string) => void;
  workspaceCompanyId?: string;
  onAddEmployee?: () => void;
}

export function StepOfficeDetails({
  draft,
  update,
  parentOptions,
  admins,
  fixedParentId,
  showErrors,
  atLimit,
  limit,
  hasMoreParents,
  isLoadingMoreParents,
  onLoadMoreParents,
  parentSearch,
  onParentSearchChange,
  workspaceCompanyId,
  onAddEmployee,
}: Props) {
  const parent = parentOptions.find((option) => option.id === draft.parentId);
  const parentItems: WizardSelectOption[] = parentOptions.map((option) => ({
    value: option.id,
    label: option.name,
    supportingText: `Bills in ${option.currency}. ${option.region}.`,
    currentLabel: isWorkspaceOwnEntity(option.id, workspaceCompanyId)
      ? "Current workspace"
      : undefined,
  }));
  const parentInvalid = showErrors && !draft.parentId;
  const nameInvalid = showErrors && !draft.name.trim();
  const addressInvalid =
    showErrors && draft.type === "physical" && !draft.address.trim();
  const adminInvalid = showErrors && draft.adminNames.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {!fixedParentId && (
        <WizardSelectField
          id="wf-parent"
          label="Parent entity"
          placeholder="Select the entity this office operates under"
          value={draft.parentId}
          onValueChange={(value) => update({ parentId: value, adminNames: [] })}
          options={parentItems}
          invalid={parentInvalid}
          errorMessage={parentInvalid ? "Select a parent entity." : undefined}
          hasMore={hasMoreParents}
          isLoadingMore={isLoadingMoreParents}
          onLoadMore={onLoadMoreParents}
          searchValue={parentSearch}
          onSearchChange={onParentSearchChange}
          searchPlaceholder="Search entities"
          emptyMessage="No entities found"
        />
      )}

      {atLimit ? (
        <OfficeLimitNotice parentName={parent?.name} limit={limit} />
      ) : (
        <>
          <OfficeBasicsFields
            draft={draft}
            update={update}
            nameInvalid={nameInvalid}
            addressInvalid={addressInvalid}
          />

          <OfficeAdminPicker
            id="wf-adminNames"
            label="Office admins"
            value={draft.adminNames}
            onChange={(adminNames) => update({ adminNames })}
            invalid={adminInvalid}
            options={admins.options}
            onQueryChange={admins.setQuery}
            hasMore={admins.hasMore}
            onLoadMore={admins.loadMore}
            isLoadingMore={admins.isFetching}
            onAddEmployee={admins.requiresCountry ? undefined : onAddEmployee}
            hint={
              admins.requiresCountry
                ? "Select a parent entity to see admins in its country."
                : `Showing employees in ${parent?.region}.`
            }
          />

          <div className="flex flex-col gap-1.5">
            <Label className={wizardLabelClass}>
              Billing currency (inherited)
            </Label>
            <div className="flex h-11 items-center rounded-lg bg-gray-50 px-3.5 text-base text-gray-600 ring-1 ring-inset ring-gray-200">
              {parent
                ? parent.currency
                : "Select a parent entity to inherit its currency"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
