"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { SelectItemType } from "@/components/base/select/select";
import EquipmentEditImageField from "../EquipmentEditImageField";
import EquipmentEditSpecFields from "../EquipmentEditSpecFields";
import { SingleEquipmentEditCoreFields } from "../SingleEquipmentEditCoreFields";
import { SingleEquipmentAddExtraFields } from "./SingleEquipmentAddExtraFields";
import { SingleEquipmentAddPriceFields } from "./SingleEquipmentAddPriceFields";
import { SingleEquipmentAddOfficeField } from "./SingleEquipmentAddOfficeField";
import { todayIsoDate } from "./equipmentPurchaseDateLimits";
import type { addSingleEquipmentSchema } from "./SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

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
  officeItems: SelectItemType[];
  employeeOptions: EmployeeOption[];
  isCurrencyLocked?: boolean;
};

const SingleEquipmentAddForm = ({
  form,
  images,
  setImages,
  countryItems,
  currencyItems,
  officeItems,
  employeeOptions,
  isCurrencyLocked,
}: Props) => {
  const watchedType = form.watch("type");
  const watchedState = form.watch("state");

  return (
    <form
      id="add-equipment-form"
      onSubmit={form.handleSubmit(() => undefined)}
      className="flex flex-col gap-4 p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SingleEquipmentEditCoreFields
          form={form}
          countryItems={countryItems}
          watchedType={watchedType}
          watchedState={watchedState}
          countrySpan="half"
          maxPurchaseDate={todayIsoDate()}
        />
        <SingleEquipmentAddExtraFields
          form={form}
          employeeOptions={employeeOptions}
        />
        <SingleEquipmentAddPriceFields
          form={form}
          currencyItems={currencyItems}
          isCurrencyLocked={isCurrencyLocked}
        />
        <SingleEquipmentAddOfficeField form={form} officeItems={officeItems} />
        <EquipmentEditSpecFields form={form} />
        <EquipmentEditImageField images={images} onChange={setImages} />
      </div>
    </form>
  );
};

export default SingleEquipmentAddForm;
