import React, { FC, memo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import { MdDeleteOutline } from "react-icons/md";
import { removeUserscore } from "@/utils/underScoreTransformer";

export interface ISpecField {
  fieldName: string;
  fieldValue: string;
}

interface Props {
  name: string;
  availableOptions: string[];
  className?: string;
  control: any;
  setValue: (name: string, value: any) => void;
}

const MultipleSpecFieldGenerator: FC<Props> = ({
  name,
  availableOptions,
  className,
  control,
  setValue,
}) => {
  const [error, setError] = useState<string | null>(null);

  const {
    field: { value: fields },
  } = useController({
    name,
    control,
  });

  const handleAddAnother = () => {
    const updatedFields = [...fields, { fieldName: "", fieldValue: "" }];
    setValue(name, updatedFields);
    setError(null);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = fields.filter(
      (_: ISpecField, i: number) => i !== index,
    );
    setValue(name, updatedFields);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedFields = fields.map((field: ISpecField, i: number) =>
      i === index ? { ...field, fieldValue: value } : field,
    );
    setValue(name, updatedFields);
  };

  const handleSelectChange = (index: number, value: string) => {
    const isDuplicate = fields.some(
      (field: ISpecField, idx: number) =>
        field.fieldName === value && idx !== index,
    );
    if (isDuplicate) {
      setError(`You cannot select "${value}" more than once.`);
    } else {
      const updatedFields = fields.map((field: ISpecField, i: number) =>
        i === index ? { ...field, fieldName: value } : field,
      );
      setValue(name, updatedFields);
      setError(null);
    }
  };

  const pHolder = (name: string) => {
    if (name === "memory" || name === "storage") {
      return "E.g 20GB";
    } else if (name === "processor") {
      return "E.g 2.14Ghz";
    }
  };

  return (
    <FormItem className={className}>
      <FormLabel>Specifications</FormLabel>
      <div className="flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-6">
          {fields?.map((field: ISpecField, index: number) => (
            <div key={index} className="flex flex-row items-center space-x-4">
              <div className="flex items-center h-[44px] w-full rounded-md border border-gray-200 bg-white  py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                <Select
                  value={field.fieldName}
                  onValueChange={(value) => handleSelectChange(index, value)}
                  data-testid="multiplespecfieldgenerator-select"
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        disabled={fields.some(
                          (f: ISpecField) => f.fieldName === option,
                        )}
                      >
                        {removeUserscore(
                          option.charAt(0).toUpperCase() + option.slice(1),
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={field.fieldValue}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={pHolder(field.fieldName)}
                  className="w-full border-x-0 rounded-tr-none rounded-br-none"
                  data-testid="multiplespecfieldgenerator-input"
                />
              </div>

              <Button
                variant="ghost"
                className="rounded-lg bg-error-50 p-3 text-error-700"
                onClick={() => handleDeleteField(index)}
                aria-label="delete"
                data-testid="multiplespecfieldgenerator-button"
              >
                <MdDeleteOutline size={20} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center gap-1 w-full">
          <Separator className="flex-1" />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAnother}
            className="!text-sm"
            data-testid="multiplespecfieldgenerator-button-2"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Spec
          </Button>
          <Separator className="flex-1" />
        </div>
      </div>

      {error && (
        <FormMessage>
          <span className="text-xs font-medium text-error-500 dark:text-error-500">
            {error}
          </span>
        </FormMessage>
      )}
    </FormItem>
  );
};

export default memo(MultipleSpecFieldGenerator);
