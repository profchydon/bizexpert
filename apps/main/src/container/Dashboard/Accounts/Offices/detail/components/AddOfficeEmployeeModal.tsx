"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAssignOfficeEmployeesMutation } from "@/api/baseQueries/companiesApi/officesApi/assignOfficeMembers";
import type { Office } from "../../../types";
import { useOfficeEmployeeOptions } from "../../hooks/useOfficeEmployeeOptions";
import { useCompanyId } from "../../hooks/useOfficesServer";
import { initialsOf } from "../../utils/mapOfficeMembers";
import { officeApiErrorMessage } from "../../utils/officeApiError";
import {
  editSubsidiaryFooterClass,
  editSubsidiaryModalBodyClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "../../../components/editSubsidiaryModalClasses";
import { OfficeMemberPicker } from "./OfficeMemberPicker";
import {
  officeModalCancelButtonClass,
  officeModalFooterButtonClass,
} from "./officeModalFieldClasses";
import { trackOfficeUpdated } from "@/lib/officeAnalytics";

interface Props {
  office: Office;
  isOpen: boolean;
  onClose: () => void;
  onAdded: (summary: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function AddOfficeEmployeeModal({
  office,
  isOpen,
  onClose,
  onAdded,
  onNotify,
}: Props) {
  const companyId = useCompanyId();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignEmployees, assignResult] = useAssignOfficeEmployeesMutation();
  const { rows, setQuery, hasMore, isFetching, loadMore } =
    useOfficeEmployeeOptions(office.region, isOpen);

  useEffect(() => {
    if (!isOpen) setSelectedIds([]);
  }, [isOpen]);

  const options = useMemo(
    () =>
      rows
        .filter(
          (employee) =>
            employee.country === office.region &&
            employee.office_id !== office.id,
        )
        .map((employee) => {
          const name = [employee.first_name, employee.last_name]
            .filter(Boolean)
            .join(" ");
          const role = employee.job_title || "Employee";
          const at = employee.office?.name;
          return {
            id: String(employee.id ?? ""),
            label: name,
            initials: initialsOf(name),
            supportingText: `${role}${at ? ` · ${at}` : ""}`,
          };
        }),
    [rows, office.id, office.region],
  );

  function handleClose() {
    onClose();
    setSelectedIds([]);
  }

  async function handleAdd() {
    if (selectedIds.length === 0 || !companyId) return;
    const labels = selectedIds
      .map((id) => options.find((option) => option.id === id)?.label)
      .filter(Boolean);
    const summary =
      selectedIds.length === 1 && labels.length === 1
        ? String(labels[0])
        : `${selectedIds.length} employees`;
    try {
      await assignEmployees({
        companyId: office.subsidiaryId,
        officeId: office.id,
        payload: { user_ids: selectedIds },
      }).unwrap();
      trackOfficeUpdated({ action: "employee_added", office_id: office.id });
      onAdded(summary);
      handleClose();
    } catch (error) {
      onNotify(
        "Employees not added",
        officeApiErrorMessage(error, `Could not add ${summary}.`),
      );
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      data-testid="addofficeemployeemodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={UserPlus} color="brand" size="md" />
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
          Add employees to {office.name}
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          Pick people from your company directory in this office&apos;s country.
          Anyone based at another office moves here.
        </p>
        <div className={editSubsidiaryModalBodyClass}>
          <OfficeMemberPicker
            label="Employees"
            placeholder="Search employees"
            hint={`Showing employees in ${office.region}.`}
            options={options}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            onQueryChange={setQuery}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoadingMore={isFetching}
          />
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={officeModalCancelButtonClass}
            onClick={handleClose}
            data-testid="addofficeemployeemodal-button"
          >
            Cancel
          </Button>
          <Button
            className={officeModalFooterButtonClass}
            disabled={selectedIds.length === 0}
            isLoading={assignResult.isLoading}
            onClick={handleAdd}
            data-testid="addofficeemployeemodal-button-2"
          >
            Add{" "}
            {selectedIds.length > 1
              ? `${selectedIds.length} employees`
              : "employee"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
