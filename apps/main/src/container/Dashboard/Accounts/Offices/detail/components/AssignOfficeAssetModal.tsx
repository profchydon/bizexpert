"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignOfficeEquipmentsMutation } from "@/api/baseQueries/companiesApi/officesApi/assignOfficeMembers";
import { useUnAndReAssignEquipmentAssigneeMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/unAndReAssignEquipmentAssignee";
import type { ServerOfficeArea } from "@/types/offices";
import type { Office } from "../../../types";
import type { OfficeAsset } from "../../types/officeAsset";
import { useOfficeEmployeesPage } from "../../hooks/useOfficeMembersServer";
import { useCompanyId } from "../../hooks/useOfficesServer";
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
import {
  officeAssetHolderKey,
  parseOfficeAssetHolder,
} from "../utils/officeAssetHolder";
import {
  officeModalCancelButtonClass,
  officeModalFooterButtonClass,
  officeModalSelectTriggerClass,
} from "./officeModalFieldClasses";

interface Props {
  office: Office;
  areas: ServerOfficeArea[];
  asset: OfficeAsset | null;
  onClose: () => void;
  onAssigned: (summary: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function AssignOfficeAssetModal({
  office,
  areas,
  asset,
  onClose,
  onAssigned,
  onNotify,
}: Props) {
  const companyId = useCompanyId();
  const { rows: employees } = useOfficeEmployeesPage(office.id, 1);
  const [holder, setHolder] = useState<string | null>(null);
  const [assignToArea, areaResult] = useAssignOfficeEquipmentsMutation();
  const [assignToPerson, personResult] =
    useUnAndReAssignEquipmentAssigneeMutation();
  const parsed = parseOfficeAssetHolder(holder);

  useEffect(() => {
    if (asset) setHolder(null);
  }, [asset]);

  const employeeLabel = useMemo(() => {
    if (parsed?.kind !== "employee") return "";
    return employees.find((employee) => employee.id === parsed.id)?.name ?? "";
  }, [employees, parsed]);

  async function handleAssign() {
    if (!asset || !parsed || !companyId) return;
    try {
      if (parsed.kind === "area") {
        const areaName =
          areas.find((area) => area.id === parsed.id)?.name ?? "this area";
        await assignToArea({
          companyId,
          officeId: office.id,
          payload: {
            equipment_ids: [asset.id],
            office_area_id: parsed.id,
          },
        }).unwrap();
        onAssigned(`${asset.name} assigned to ${areaName}.`);
      } else {
        await assignToPerson({
          companyId,
          equipment_id: asset.id,
          payload: { assignee: { id: parsed.id, name: employeeLabel } },
        }).unwrap();
        onAssigned(
          `${asset.name} assigned to ${employeeLabel || "this person"}.`,
        );
      }
      onClose();
    } catch (error) {
      onNotify(
        "Device not assigned",
        officeApiErrorMessage(error, `Could not assign ${asset.name}.`),
      );
    }
  }

  return (
    <Dialog
      open={asset !== null}
      onOpenChange={(open) => !open && onClose()}
      data-testid="assignofficeassetmodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={Package} color="brand" size="md" />
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
          Assign {asset?.name}
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          This device was bought for {office.name} and has not been placed yet.
          Put it in a room, or hand it to someone who works here.
        </p>
        <div className={editSubsidiaryModalBodyClass}>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Assign to
            </Label>
            <Select
              value={holder ?? undefined}
              onValueChange={setHolder}
              data-testid="assignofficeassetmodal-select"
            >
              <SelectTrigger className={officeModalSelectTriggerClass}>
                <SelectValue placeholder="Pick a room or a person" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Office areas</SelectLabel>
                  {areas.map((area) => (
                    <SelectItem
                      key={area.id}
                      value={officeAssetHolderKey({
                        kind: "area",
                        id: area.id,
                      })}
                    >
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>People at this office</SelectLabel>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={officeAssetHolderKey({
                        kind: "employee",
                        id: employee.id,
                      })}
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={officeModalCancelButtonClass}
            onClick={onClose}
            data-testid="assignofficeassetmodal-button"
          >
            Cancel
          </Button>
          <Button
            className={officeModalFooterButtonClass}
            disabled={!parsed}
            isLoading={areaResult.isLoading || personResult.isLoading}
            onClick={handleAssign}
            data-testid="assignofficeassetmodal-button-2"
          >
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
