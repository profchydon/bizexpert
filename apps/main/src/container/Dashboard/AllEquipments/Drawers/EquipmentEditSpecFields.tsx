"use client";

import { Plus, Trash01 } from "@untitledui/icons";
import type { UseFormReturn } from "react-hook-form";
import { useController } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/base/buttons/button";
import type { ISpecField } from "@/components/MultipleSpecFieldGenerator";
import type { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";
import { DEVICE_SPEC_OPTIONS } from "./deviceSpecification/deviceSpecificationOptions";
import { isRestrictedSpecKey } from "./deviceSpecification/specSuggestions";
import EquipmentEditSpecField from "./EquipmentEditSpecField";
import {
  optionsForEquipmentSpec,
  toEquipmentSpecFields,
} from "./toEquipmentSpecFields";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

type Props = {
  form: UseFormReturn<FormValues>;
};

const EquipmentEditSpecFields = ({ form }: Props) => {
  const {
    field: { value: fields },
  } = useController({ name: "properties", control: form.control });
  const specFields = toEquipmentSpecFields(fields);
  const usedKeys = new Set(specFields.map((field) => field.fieldName));

  const updateFields = (next: ISpecField[]) =>
    form.setValue("properties", next);

  const addSpec = () => {
    const nextKey = DEVICE_SPEC_OPTIONS.find(
      (option) => !usedKeys.has(option.value),
    )?.value;
    updateFields([...specFields, { fieldName: nextKey ?? "", fieldValue: "" }]);
  };

  const canAddMore = usedKeys.size < DEVICE_SPEC_OPTIONS.length;

  return (
    <div className="col-span-2 rounded-xl border border-secondary bg-primary p-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-secondary">Specification</p>
        {specFields.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
            {specFields.map((field, index) => (
              <div
                key={`${field.fieldName}-${index}`}
                className="flex items-center gap-2"
              >
                <div className="min-w-0 flex-1">
                  <EquipmentEditSpecField
                    typeValue={field.fieldName}
                    value={field.fieldValue}
                    options={optionsForEquipmentSpec(field.fieldName, usedKeys)}
                    restrictValue={isRestrictedSpecKey(field.fieldName)}
                    onTypeChange={(key) =>
                      updateFields(
                        specFields.map((item, i) =>
                          i === index
                            ? { fieldName: key, fieldValue: "" }
                            : item,
                        ),
                      )
                    }
                    onValueChange={(value) =>
                      updateFields(
                        specFields.map((item, i) =>
                          i === index ? { ...item, fieldValue: value } : item,
                        ),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  aria-label="Remove specification"
                  onClick={() =>
                    updateFields(specFields.filter((_, i) => i !== index))
                  }
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-quaternary transition hover:bg-secondary hover:text-secondary"
                  data-testid="multiplespecfieldgenerator-button"
                >
                  <Trash01 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {canAddMore ? (
          <Button
            type="button"
            color="secondary"
            iconLeading={Plus}
            onClick={addSpec}
            className="w-max"
            data-testid="equipmenteditspecfields-button"
          >
            Add Specification
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default EquipmentEditSpecFields;
