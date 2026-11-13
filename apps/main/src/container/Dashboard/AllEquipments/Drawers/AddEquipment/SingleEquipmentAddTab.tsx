"use client";

import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getAddEquipmentSaveDisabledReason } from "./submitSingleEquipmentCreate";
import { addEquipmentFooterBorderClass } from "./addEquipmentSlideoutResize";
import SingleEquipmentAddForm from "./SingleEquipmentAddForm";
import { useSingleEquipmentAddForm } from "./useSingleEquipmentAddForm";

type Props = {
  onClose: () => void;
};

const SingleEquipmentAddTab = ({ onClose }: Props) => {
  const {
    form,
    save,
    images,
    setImages,
    isSaving,
    canSave,
    countryItems,
    currencyItems,
    officeItems,
    employeeOptions,
    isCurrencyLocked,
  } = useSingleEquipmentAddForm(onClose);

  const watched = form.watch();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-primary">
        <SingleEquipmentAddForm
          form={form}
          images={images}
          setImages={setImages}
          countryItems={countryItems}
          currencyItems={currencyItems}
          officeItems={officeItems}
          employeeOptions={employeeOptions}
          isCurrencyLocked={isCurrencyLocked}
        />
      </div>

      <div
        className={`flex w-full shrink-0 items-center justify-end gap-3 px-6 py-4 ${addEquipmentFooterBorderClass}`}
      >
        <Button
          size="md"
          color="secondary"
          onPress={onClose}
          data-testid="singleequipmentaddtab-button"
        >
          Cancel
        </Button>
        <DisabledWithTooltip
          isDisabled={!canSave}
          reason={getAddEquipmentSaveDisabledReason(
            watched.title,
            watched.type,
            watched.state,
            String(watched.status ?? ""),
            String(watched.assignee ?? ""),
            isSaving,
            String(watched.purchase_date ?? ""),
          )}
        >
          <Button
            size="md"
            isDisabled={!canSave}
            isLoading={isSaving}
            onPress={() => void save()}
            data-testid="singleequipmentaddtab-button-2"
          >
            Save
          </Button>
        </DisabledWithTooltip>
      </div>
    </>
  );
};

export default SingleEquipmentAddTab;
