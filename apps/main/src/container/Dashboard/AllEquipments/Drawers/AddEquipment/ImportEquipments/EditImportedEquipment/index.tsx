"use client";

import { ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getEditImportedEquipmentSaveDisabledReason } from "./mapImportedEquipmentToForm";
import { addEquipmentFooterBorderClass } from "../../addEquipmentSlideoutResize";
import EditImportedEquipmentForm from "./EditImportedEquipmentForm";
import { useEditImportedEquipmentForm } from "./useEditImportedEquipmentForm";

type Props = {
  equipment_id?: string;
  onBack: () => void;
};

const EditImportedEquipment = ({ equipment_id = "", onBack }: Props) => {
  const {
    form,
    save,
    images,
    setImages,
    canSave,
    countryItems,
    currencyItems,
    employeeOptions,
    equipment,
  } = useEditImportedEquipmentForm(equipment_id, onBack);

  if (!equipment) return null;

  const watched = form.watch();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-6 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary"
          data-testid="editimportedequipment-back"
        >
          <ArrowLeft className="size-4" />
          Go back
        </button>
        <div className="mt-4 border-b border-border-secondary pb-4">
          <p className="text-sm font-semibold text-primary">
            {equipment.title}
          </p>
          <p className="text-sm text-tertiary">{equipment.serial_number}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-primary">
        <EditImportedEquipmentForm
          form={form}
          images={images}
          setImages={setImages}
          countryItems={countryItems}
          currencyItems={currencyItems}
          employeeOptions={employeeOptions}
        />
      </div>

      <div
        className={`flex w-full shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEquipmentFooterBorderClass}`}
      >
        <Button
          size="md"
          color="secondary"
          onPress={onBack}
          data-testid="editimportedequipment-button"
        >
          Cancel
        </Button>
        <DisabledWithTooltip
          isDisabled={!canSave}
          reason={getEditImportedEquipmentSaveDisabledReason(
            watched.title,
            watched.type,
            watched.state,
            watched.purchase_price,
            watched.currency_id,
            String(watched.status ?? ""),
            String(watched.assignee ?? ""),
          )}
        >
          <Button
            size="md"
            isDisabled={!canSave}
            onPress={() => void save()}
            data-testid="editimportedequipment-button-2"
          >
            Save
          </Button>
        </DisabledWithTooltip>
      </div>
    </div>
  );
};

export default EditImportedEquipment;
