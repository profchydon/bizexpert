"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { SelectItemType } from "@/components/base/select/select";
import EquipmentEditImageField from "../../../EquipmentEditImageField";
import { SingleEquipmentEditCoreFields } from "../../../SingleEquipmentEditCoreFields";
import { SingleEquipmentAddExtraFields } from "../../SingleEquipmentAddExtraFields";
import EditImportedEquipmentPriceFields from "./EditImportedEquipmentPriceFields";
import type { editImportedEquipmentSchema } from "./validation";
import type { addSingleEquipmentSchema } from "../../SingleEquipment/validation";

type FormValues = z.infer<typeof editImportedEquipmentSchema>;

type EmployeeOption = {
  value: string;
  label: string;
};

type Props = {
  form: UseFormReturn<FormValues>;
  images: File[] | string[];
  setImages: (images: File[] | string[]) => void;
  countryItems: SelectItemType[];
  currencyItems: SelectItemType[];
  employeeOptions: EmployeeOption[];
};

const EditImportedEquipmentForm = ({
  form,
  images,
  setImages,
  countryItems,
  currencyItems,
  employeeOptions,
}: Props) => {
  const watchedType = form.watch("type");
  const watchedState = form.watch("state");
  const coreForm = form as unknown as UseFormReturn<
    z.infer<typeof addSingleEquipmentSchema>
  >;

  return (
    <form
      id="edit-imported-equipment-form"
      onSubmit={form.handleSubmit(() => undefined)}
      className="flex flex-col gap-4 p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SingleEquipmentEditCoreFields
          form={coreForm}
          countryItems={countryItems}
          watchedType={watchedType}
          watchedState={watchedState}
          countrySpan="half"
        />
        <SingleEquipmentAddExtraFields
          form={coreForm}
          employeeOptions={employeeOptions}
        />
        <EditImportedEquipmentPriceFields
          form={form}
          currencyItems={currencyItems}
        />
        <EquipmentEditImageField images={images} onChange={setImages} />
      </div>
    </form>
  );
};

export default EditImportedEquipmentForm;
