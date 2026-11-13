"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fulfillmentOptions } from "../data/fulfillment";
import type { FulfillmentMode } from "../types";

interface Props {
  name: string;
  description: string;
  fulfillmentMode: FulfillmentMode;
  nameError?: string;
  withSeparator?: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFulfillmentModeChange: (value: FulfillmentMode) => void;
}

const KitDetailsFields = ({
  name,
  description,
  fulfillmentMode,
  nameError,
  withSeparator = false,
  onNameChange,
  onDescriptionChange,
  onFulfillmentModeChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel label="Kit Name" required />
        <Input
          value={name}
          maxLength={80}
          placeholder="e.g. Engineering Starter Kit"
          onChange={(event) => onNameChange(event.target.value)}
          className={cn(nameError && "border-error-300")}
          data-testid="kitdetailsfields-input"
        />
        {nameError && (
          <p className="mt-1.5 text-sm text-error-600">{nameError}</p>
        )}
      </div>

      <div>
        <FieldLabel label="Description" />
        <Textarea
          value={description}
          maxLength={300}
          rows={3}
          placeholder="Add a note about this kit for your team."
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="resize-none"
        />
      </div>

      {withSeparator && <div className="h-px w-full bg-gray-200" />}

      <div className="flex flex-col gap-2">
        <FieldLabel label="Fulfillment Mode" />
        <RadioGroup
          value={fulfillmentMode}
          onValueChange={(value) =>
            onFulfillmentModeChange(value as FulfillmentMode)
          }
          className="gap-3"
          data-testid="kitdetailsfields-radiogroup"
        >
          {fulfillmentOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border p-4 transition",
                fulfillmentMode === option.value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <RadioGroupItem
                value={option.value}
                className={cn(
                  "mt-0.5 size-4 border-gray-300",
                  fulfillmentMode === option.value &&
                    "border-primary-600 bg-primary-600 text-white",
                )}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm font-normal leading-6 text-gray-600">
                  {option.hint}
                </span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <label className="mb-1.5 block text-sm font-medium text-gray-700">
    {label}
    {required && <span className="ml-0.5 text-primary-600">*</span>}
  </label>
);

export default KitDetailsFields;
