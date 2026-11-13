"use client";

import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { OfficeDraft } from "../../types";
import { WizardRadioCard } from "../../components/wizard/WizardRadioCard";
import { wizardLabelClass } from "../../components/wizard/wizardFieldClasses";

interface Props {
  draft: OfficeDraft;
  update: (patch: Partial<OfficeDraft>) => void;
  nameInvalid: boolean;
  addressInvalid: boolean;
}

export function OfficeBasicsFields({
  draft,
  update,
  nameInvalid,
  addressInvalid,
}: Props) {
  return (
    <>
      <div id="wf-name" className="flex flex-col gap-1.5">
        <Label className={wizardLabelClass}>Office name</Label>
        <Input
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="e.g. London HQ"
          className={cn(
            "rounded-lg px-3.5 text-base",
            nameInvalid && "border-error-500",
          )}
          data-testid="officebasicsfields-input"
        />
        {nameInvalid && (
          <p className="text-sm text-error-600">Enter an office name.</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={wizardLabelClass}>Office type</Label>
        <RadioGroup
          value={draft.type}
          onValueChange={(value) =>
            update({ type: value as OfficeDraft["type"] })
          }
          className="grid gap-3 sm:grid-cols-2"
          data-testid="officebasicsfields-radiogroup"
        >
          <WizardRadioCard
            value="physical"
            selected={draft.type === "physical"}
            label="Physical"
            description="A location with an address."
          />
          <WizardRadioCard
            value="remote"
            selected={draft.type === "remote"}
            label="Remote"
            description="A distributed, remote workforce."
          />
        </RadioGroup>
      </div>

      {draft.type === "physical" && (
        <div id="wf-address" className="flex flex-col gap-1.5">
          <Label className={wizardLabelClass}>Office address</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-5 -translate-y-1/2 text-gray-400" />
            <Input
              value={draft.address}
              onChange={(event) => update({ address: event.target.value })}
              placeholder="Street, city, postcode"
              className={cn(
                "rounded-lg pl-[42px] text-base",
                addressInvalid && "border-error-500",
              )}
              data-testid="officebasicsfields-input-2"
            />
          </div>
          {addressInvalid && (
            <p className="text-sm text-error-600">Enter an office address.</p>
          )}
        </div>
      )}
    </>
  );
}
