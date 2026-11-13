"use client";

import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useInviteOfficeAdminsMutation } from "@/api/baseQueries/companiesApi/officesApi/inviteOfficeAdmins";
import { useUpdateOfficeMutation } from "@/api/baseQueries/companiesApi/officesApi/updateOffice";
import type { Office } from "../../../types";
import { useOfficeAdminOptions } from "../../hooks/useOfficeAdminOptions";
import { officeApiErrorMessage } from "../../utils/officeApiError";
import { OfficeAdminPicker } from "../../wizard/OfficeAdminPicker";
import { EditOfficeFields } from "./EditOfficeFields";
import {
  editSubsidiaryFooterClass,
  editSubsidiaryModalBodyClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "../../../components/editSubsidiaryModalClasses";
import { getOfficeEditValidation } from "../utils/officeEditValidation";
import { trackOfficeUpdated } from "@/lib/officeAnalytics";
import {
  officeModalCancelButtonClass,
  officeModalFieldHintClass,
  officeModalFooterButtonClass,
} from "./officeModalFieldClasses";

interface Props {
  office: Office | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (name: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function EditOfficeModal({
  office,
  isOpen,
  onClose,
  onSaved,
  onNotify,
}: Props) {
  const [name, setName] = useState("");
  const [physical, setPhysical] = useState(true);
  const [address, setAddress] = useState("");
  const [newAdminIds, setNewAdminIds] = useState<string[]>([]);
  const admins = useOfficeAdminOptions(!isOpen, office?.region, {
    companyId: office?.subsidiaryId,
  });
  const [updateOffice, updateResult] = useUpdateOfficeMutation();
  const [inviteAdmins, inviteResult] = useInviteOfficeAdminsMutation();

  useEffect(() => {
    if (!isOpen || !office) return;
    setName(office.name);
    setPhysical(office.type === "Physical");
    setAddress(office.address ?? "");
    setNewAdminIds([]);
  }, [isOpen, office]);

  const { nameInvalid, addressInvalid, canSave } = getOfficeEditValidation({
    name,
    physical,
    address,
  });

  async function handleSave() {
    if (!canSave || !office?.subsidiaryId) return;
    const companyId = office.subsidiaryId;
    try {
      await updateOffice({
        companyId,
        officeId: office.id,
        payload: {
          name: name.trim(),
          type: physical ? "physical" : "remote",
          street_address: physical ? address.trim() : null,
        },
      }).unwrap();
      if (newAdminIds.length > 0) {
        await inviteAdmins({
          companyId,
          officeId: office.id,
          payload: { admin_user_ids: newAdminIds },
        }).unwrap();
      }
      trackOfficeUpdated({ action: "edited", office_id: office.id });
      onSaved(name.trim());
    } catch (error) {
      onNotify(
        "Office not updated",
        officeApiErrorMessage(error, `Could not update ${office.name}.`),
      );
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="editofficemodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={Pencil} color="brand" size="md" />
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
          Edit {office?.name ?? "office"}
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          Update the office name, type, address, and admins. Currency and region
          stay locked.
        </p>
        <div className={editSubsidiaryModalBodyClass}>
          <EditOfficeFields
            name={name}
            onNameChange={setName}
            nameInvalid={nameInvalid}
            physical={physical}
            onPhysicalChange={setPhysical}
            address={address}
            onAddressChange={setAddress}
            addressInvalid={addressInvalid}
          />
          <div className="flex flex-col gap-1.5">
            <OfficeAdminPicker
              label="Invite office admins"
              value={newAdminIds}
              onChange={setNewAdminIds}
              options={admins.options}
              onQueryChange={admins.setQuery}
              hasMore={admins.hasMore}
              onLoadMore={admins.loadMore}
              isLoadingMore={admins.isFetching}
            />
            <p className={officeModalFieldHintClass}>
              {admins.requiresCountry
                ? "Office region is required to list admins."
                : `Showing people in ${office?.region}. Invites are add-only. Current admins stay on this office.`}
            </p>
          </div>
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={officeModalCancelButtonClass}
            onClick={onClose}
            data-testid="editofficemodal-button"
          >
            Cancel
          </Button>
          <Button
            className={officeModalFooterButtonClass}
            disabled={!canSave}
            isLoading={updateResult.isLoading || inviteResult.isLoading}
            onClick={handleSave}
            data-testid="editofficemodal-button-2"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
