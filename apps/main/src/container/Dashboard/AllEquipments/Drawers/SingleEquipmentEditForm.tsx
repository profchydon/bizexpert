"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { SelectItemType } from "@/components/base/select/select";
import EquipmentEditImageField from "./EquipmentEditImageField";
import EquipmentEditSpecFields from "./EquipmentEditSpecFields";
import { SingleEquipmentEditCoreFields } from "./SingleEquipmentEditCoreFields";
import { SingleEquipmentAddOfficeField } from "./AddEquipment/SingleEquipmentAddOfficeField";
import { SingleEquipmentAddPriceFields } from "./AddEquipment/SingleEquipmentAddPriceFields";
import { todayIsoDate } from "./AddEquipment/equipmentPurchaseDateLimits";
import type { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
  images: File[] | string[];
  setImages: (images: File[] | string[]) => void;
  countryItems: SelectItemType[];
  currencyItems: SelectItemType[];
  officeItems: SelectItemType[];
  currencyHint?: string;
  isCurrencyLocked?: boolean;
};

const SingleEquipmentEditForm = ({
  form,
  images,
  setImages,
  countryItems,
  currencyItems,
  officeItems,
  currencyHint,
  isCurrencyLocked,
}: Props) => {
  const watchedType = form.watch("type");
  const watchedState = form.watch("state");

  return (
    <form
      id="edit-equipment-form"
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
        <SingleEquipmentAddPriceFields
          form={form}
          currencyItems={currencyItems}
          isCurrencyLocked={isCurrencyLocked}
          currencyHint={currencyHint}
        />
        <SingleEquipmentAddOfficeField form={form} officeItems={officeItems} />
        <EquipmentEditSpecFields form={form} />
        <EquipmentEditImageField images={images} onChange={setImages} />
      </div>
    </form>
  );
};

export default SingleEquipmentEditForm;
