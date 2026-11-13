"use client";

import { useParams, useSearchParams } from "next/navigation";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getEditEquipmentSaveDisabledReason } from "./editSingleEquipmentForm";
import { EDIT_SINGLE_EQUIPMENT_SLIDEOUT_RESIZE } from "./editSingleEquipmentSlideoutResize";
import SingleEquipmentEditForm from "./SingleEquipmentEditForm";
import { useSingleEquipmentEditForm } from "./useSingleEquipmentEditForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  equipmentDetailsInstance?: boolean;
  removeSubmitRoute?: boolean;
};

const EditSingleEquipmentDrawer = ({
  isOpen,
  onClose,
  equipmentDetailsInstance = false,
  removeSubmitRoute: _removeSubmitRoute,
}: Props) => {
  const params = useParams<{ equipmentId?: string }>();
  const searchParams = useSearchParams();
  const equipmentId = equipmentDetailsInstance
    ? (params.equipmentId ?? "")
    : (searchParams.get("edit_equipment_id") ?? "");

  const {
    form,
    save,
    images,
    setImages,
    isLoading,
    isSaving,
    canSave,
    countryItems,
    currencyItems,
    officeItems,
    currencyHint,
    isCurrencyLocked,
  } = useSingleEquipmentEditForm(equipmentId, onClose);

  const saveDisabled = !canSave || isLoading || !equipmentId;

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Edit equipment"
      dialogClassName="overflow-hidden"
      resizeOptions={EDIT_SINGLE_EQUIPMENT_SLIDEOUT_RESIZE}
      data-testid="editsingleequipment-drawerright"
    >
      <div className="flex w-full shrink-0 items-start justify-between px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-primary">Edit Equipment</h2>
          <p className="mt-0.5 text-sm text-tertiary">
            Make updates to existing equipment.
          </p>
        </div>
        <CloseButton size="sm" onPress={onClose} />
      </div>

      <div className="h-px w-full shrink-0 bg-border-secondary" />

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        {!isLoading && equipmentId ? (
          <SingleEquipmentEditForm
            form={form}
            images={images}
            setImages={setImages}
            countryItems={countryItems}
            currencyItems={currencyItems}
            officeItems={officeItems}
            currencyHint={currencyHint}
            isCurrencyLocked={isCurrencyLocked}
          />
        ) : null}
      </div>

      <div className="flex w-full shrink-0 items-center justify-end gap-3 border-t border-secondary px-6 py-4">
        <Button
          size="md"
          color="secondary"
          onClick={onClose}
          data-testid="editsingleequipment-button"
        >
          Cancel
        </Button>
        <DisabledWithTooltip
          isDisabled={saveDisabled}
          reason={getEditEquipmentSaveDisabledReason(
            form.watch("title"),
            form.watch("type"),
            form.watch("state"),
            isSaving,
            isLoading,
            equipmentId,
            String(form.watch("purchase_date") ?? ""),
          )}
        >
          <Button
            size="md"
            isDisabled={saveDisabled}
            isLoading={isSaving}
            onClick={() => void save()}
            data-testid="editsingleequipment-button-2"
          >
            Save
          </Button>
        </DisabledWithTooltip>
      </div>
    </SlideoutMenu>
  );
};

export default EditSingleEquipmentDrawer;
