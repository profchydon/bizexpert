"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateOfficeMutation } from "@/api/baseQueries/companiesApi/officesApi/createOffice";
import { parentAtLimit, useOfficeWizard } from "../hooks/useOfficeWizard";
import { useAccountsPlanTier } from "../../hooks/useAccountsData";
import { useOfficeCreateLimit } from "../hooks/useOfficeCreateLimit";
import { useOfficeAdminOptions } from "../hooks/useOfficeAdminOptions";
import { useCompanyId } from "../hooks/useOfficesServer";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import routes from "@/routes";
import AddEmployees from "@/container/Dashboard/EquipEmployee/Employee/AddEmployees";
import type { OfficeParent } from "../../types";
import { officeApiErrorMessage } from "../utils/officeApiError";
import { PLAN_LABEL, nextPlan } from "../../utils/planMeta";
import { buildCreateOfficePayload } from "./buildCreateOfficePayload";
import { trackOfficeUpdated } from "@/lib/officeAnalytics";
import { OfficeDonePanel } from "./OfficeDonePanel";
import { StepOfficeDetails } from "./StepOfficeDetails";
import { CreateOfficeFooter } from "./CreateOfficeFooter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  parentOptions: OfficeParent[];
  fixedParentId?: string;
  onCreated?: (summary: { id: string; name: string }) => void;
  hasMoreParents?: boolean;
  isLoadingMoreParents?: boolean;
  onLoadMoreParents?: () => void;
  parentSearch?: string;
  onParentSearchChange?: (value: string) => void;
}

export function CreateOfficeWizard({
  isOpen,
  onClose,
  parentOptions,
  fixedParentId,
  onCreated,
  hasMoreParents,
  isLoadingMoreParents,
  onLoadMoreParents,
  parentSearch,
  onParentSearchChange,
}: Props) {
  const planTier = useAccountsPlanTier();
  const companyId = useCompanyId();
  const workspaceCompanyId = useWorkspaceCompanyId();
  const wizard = useOfficeWizard(fixedParentId);
  const [createOffice, createResult] = useCreateOfficeMutation();
  const [showErrors, setShowErrors] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const { push, isPending: isUpgrading } = useTransitionRouter();

  const officeCap = useOfficeCreateLimit(planTier);
  const limit = officeCap.limit;
  const parent = parentOptions.find(
    (option) => option.id === wizard.draft.parentId,
  );
  const admins = useOfficeAdminOptions(!isOpen, parent?.region, {
    companyId: parent?.id,
  });
  const atLimit = officeCap.atLimit || parentAtLimit(parent, limit);
  const upgradeLabel = nextPlan(planTier)
    ? `Upgrade to ${PLAN_LABEL[nextPlan(planTier)!]}`
    : "See plans";

  function handleClose() {
    onClose();
    wizard.reset();
    setShowErrors(false);
    setDone(false);
    setServerError(null);
    setIsAddingEmployee(false);
  }

  async function handleCreate() {
    if (atLimit || !parent || !companyId || createResult.isLoading) return;
    const invalidField = wizard.firstInvalidField();
    if (invalidField) {
      setShowErrors(true);
      document
        .getElementById(`wf-${invalidField}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    const name = wizard.draft.name.trim();
    const payload = buildCreateOfficePayload(
      wizard.draft,
      parent.id,
      workspaceCompanyId,
    );

    try {
      const response = await createOffice({ companyId, payload }).unwrap();
      const created = response.data;
      setServerError(null);
      trackOfficeUpdated({
        action: "created",
        ...(created?.id ? { office_id: created.id } : {}),
      });
      onCreated?.({ id: created?.id ?? "", name: created?.name ?? name });
      setDone(true);
    } catch (error) {
      setServerError(
        officeApiErrorMessage(error, `Could not create ${name || "office"}.`),
      );
    }
  }

  return (
    <>
      {/* The add-employee slideout cannot take focus inside this modal, so
          the dialog steps aside while it is open; the draft is kept. */}
      <Dialog
        open={isOpen && !isAddingEmployee}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        data-testid="createofficewizard-dialog"
      >
        <DialogContent
          className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-h-[85vh] sm:rounded-2xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Create office</DialogTitle>
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 pb-4 pt-5 sm:px-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Create office
              </h2>
              <DialogDescription>
                Add an office under a billing entity. It inherits that
                entity&apos;s currency.
              </DialogDescription>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-50"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {done ? (
              <OfficeDonePanel
                name={wizard.draft.name}
                parentName={parent?.name ?? ""}
              />
            ) : (
              <StepOfficeDetails
                draft={wizard.draft}
                update={wizard.update}
                parentOptions={parentOptions}
                admins={admins}
                fixedParentId={fixedParentId}
                showErrors={showErrors}
                atLimit={atLimit}
                limit={limit}
                hasMoreParents={hasMoreParents}
                isLoadingMoreParents={isLoadingMoreParents}
                onLoadMoreParents={onLoadMoreParents}
                parentSearch={parentSearch}
                onParentSearchChange={onParentSearchChange}
                workspaceCompanyId={workspaceCompanyId}
                onAddEmployee={() => setIsAddingEmployee(true)}
              />
            )}
            {!done && serverError && (
              <p className="mt-4 text-sm text-error-600">{serverError}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-4 sm:px-6">
            <CreateOfficeFooter
              done={done}
              atLimit={atLimit}
              isSaving={createResult.isLoading}
              isUpgrading={isUpgrading}
              upgradeLabel={upgradeLabel}
              onClose={handleClose}
              onCreate={handleCreate}
              onUpgrade={() => push(routes.SETTINGS_SUBSCRIPTION)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {parent && (
        <AddEmployees
          isOpen={isAddingEmployee}
          onClose={() => setIsAddingEmployee(false)}
          initialTab="add"
          hideTabs
          employeepage_instance
          companyId={parent.id}
          initialCountry={parent.region}
          lockCountryToInitial
        />
      )}
    </>
  );
}
