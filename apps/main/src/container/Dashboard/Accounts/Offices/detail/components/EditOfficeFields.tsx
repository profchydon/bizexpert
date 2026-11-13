"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardRadioCard } from "../../../components/wizard/WizardRadioCard";
import {
  officeModalErrorHintClass,
  officeModalTextInputClass,
} from "./officeModalFieldClasses";

interface Props {
  name: string;
  onNameChange: (value: string) => void;
  nameInvalid: boolean;
  physical: boolean;
  onPhysicalChange: (value: boolean) => void;
  address: string;
  onAddressChange: (value: string) => void;
  addressInvalid: boolean;
}

export function EditOfficeFields({
  name,
  onNameChange,
  nameInvalid,
  physical,
  onPhysicalChange,
  address,
  onAddressChange,
  addressInvalid,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-gray-700">Office name</Label>
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. London HQ"
          className={officeModalTextInputClass}
          data-testid="editofficefields-input"
        />
        {nameInvalid && (
          <p className={officeModalErrorHintClass}>Enter an office name.</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-gray-700">Office type</Label>
        <RadioGroupPrimitive.Root
          value={physical ? "physical" : "remote"}
          onValueChange={(value) => onPhysicalChange(value === "physical")}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <WizardRadioCard
            value="physical"
            selected={physical}
            label="Physical"
            description="A location with an address."
          />
          <WizardRadioCard
            value="remote"
            selected={!physical}
            label="Remote"
            description="A distributed, remote workforce."
          />
        </RadioGroupPrimitive.Root>
      </div>
      {physical && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-gray-700">
            Office address
          </Label>
          <Input
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="Street, city, postcode"
            className={officeModalTextInputClass}
            data-testid="editofficefields-input-2"
          />
          {addressInvalid && (
            <p className={officeModalErrorHintClass}>
              Enter an office address.
            </p>
          )}
        </div>
      )}
    </>
  );
}
