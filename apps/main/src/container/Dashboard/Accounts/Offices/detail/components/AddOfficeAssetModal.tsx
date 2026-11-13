"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAssignOfficeEquipmentsMutation } from "@/api/baseQueries/companiesApi/officesApi/assignOfficeMembers";
import type { ServerOfficeArea } from "@/types/offices";
import type { Office } from "../../../types";
import { useOfficeAreaCreate } from "../../hooks/useOfficeAreaCreate";
import { useOfficeAssetOptions } from "../../hooks/useOfficeAssetOptions";
import { useCompanyId } from "../../hooks/useOfficesServer";
import { isOfficeAddableAsset } from "../../utils/isOfficeAddableAsset";
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
import { toAssetPickerOption } from "./assetPickerOption";
import { OfficeMemberPicker } from "./OfficeMemberPicker";
import { OfficeAreaField } from "./OfficeAreaField";
import { OfficeAreaModal } from "./OfficeAreaModal";
import { NO_AREA_VALUE } from "./OfficeAreaSelect";
import {
  officeModalCancelButtonClass,
  officeModalFooterButtonClass,
} from "./officeModalFieldClasses";

interface Props {
  office: Office;
  areas: ServerOfficeArea[];
  isOpen: boolean;
  onClose: () => void;
  onAdded: (summary: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function AddOfficeAssetModal({
  office,
  areas,
  isOpen,
  onClose,
  onAdded,
  onNotify,
}: Props) {
  const companyId = useCompanyId();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [areaId, setAreaId] = useState(NO_AREA_VALUE);
  const [assignEquipments, assignResult] = useAssignOfficeEquipmentsMutation();
  const { rows, setQuery, hasMore, isFetching, loadMore } =
    useOfficeAssetOptions(isOpen, office.subsidiaryId);
  const areaCreate = useOfficeAreaCreate({
    office,
    areas,
    onSelect: setAreaId,
    onNotify,
  });

  useEffect(() => {
    if (isOpen) setAreaId(areas[0]?.id ?? NO_AREA_VALUE);
  }, [areas, isOpen]);

  useEffect(() => {
    if (!isOpen) setSelectedIds([]);
  }, [isOpen]);

  const options = useMemo(
    () =>
      rows
        .filter((row) =>
          isOfficeAddableAsset(row, office.id, office.subsidiaryId, companyId),
        )
        .map(toAssetPickerOption),
    [rows, office.id, office.subsidiaryId, companyId],
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
        : `${selectedIds.length} assets`;
    try {
      await assignEquipments({
        companyId: office.subsidiaryId,
        officeId: office.id,
        payload: {
          equipment_ids: selectedIds,
          office_area_id: areaId === NO_AREA_VALUE ? undefined : areaId,
        },
      }).unwrap();
      onAdded(summary);
      handleClose();
    } catch (error) {
      onNotify(
        "Assets not added",
        officeApiErrorMessage(error, `Could not add ${summary}.`),
      );
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && !areaCreate.isModalOpen}
        onOpenChange={(open) => !open && handleClose()}
        data-testid="addofficeassetmodal-dialog"
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
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <DialogTitle className={editSubsidiaryModalTitleClass}>
            Add assets to {office.name}
          </DialogTitle>
          <p className={editSubsidiaryModalDescriptionClass}>
            Pick devices held at another office or unassigned. Devices assigned
            to an employee stay with them and aren&apos;t shown.
          </p>
          <div className={editSubsidiaryModalBodyClass}>
            <OfficeMemberPicker
              label="Assets"
              placeholder="Search devices"
              options={options}
              selectedIds={selectedIds}
              onChange={setSelectedIds}
              onQueryChange={setQuery}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isFetching}
            />
            <OfficeAreaField
              areas={areaCreate.mergedAreas}
              value={areaId}
              onChange={setAreaId}
              onAddArea={areaCreate.openModal}
            />
          </div>
          <div className={editSubsidiaryFooterClass}>
            <Button
              variant="outline"
              className={officeModalCancelButtonClass}
              onClick={handleClose}
              data-testid="addofficeassetmodal-button"
            >
              Cancel
            </Button>
            <Button
              className={officeModalFooterButtonClass}
              disabled={selectedIds.length === 0}
              isLoading={assignResult.isLoading}
              onClick={handleAdd}
              data-testid="addofficeassetmodal-button-2"
            >
              Add{" "}
              {selectedIds.length > 1
                ? `${selectedIds.length} assets`
                : "asset"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <OfficeAreaModal
        isOpen={areaCreate.isModalOpen}
        mode="add"
        existing={areaCreate.mergedAreas.map((area) => area.name)}
        isSubmitting={areaCreate.isCreating}
        onClose={areaCreate.closeModal}
        onSubmit={areaCreate.create}
      />
    </>
  );
}
