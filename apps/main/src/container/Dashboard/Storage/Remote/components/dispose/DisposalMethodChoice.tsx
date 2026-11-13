"use client";

import { DisabledRadioOption } from "@/components/base/radio-buttons/disabled-radio-option";
import {
  RadioButton,
  RadioGroup,
} from "@/components/base/radio-buttons/radio-buttons";
import type { DisposalMethod } from "../../types/storage";

export const DEFAULT_DISPOSAL_METHOD: DisposalMethod = "destroy";

export function DisposalMethodChoice({
  value,
  onChange,
}: {
  value: DisposalMethod;
  onChange: (method: DisposalMethod) => void;
}) {
  return (
    <RadioGroup
      aria-label="Disposal method"
      value={value}
      onChange={(v) => onChange(v as DisposalMethod)}
      data-testid="disposalmethodchoice-radiogroup"
    >
      <DisabledRadioOption
        tooltip="Coming soon"
        label="Donate to the Impact Program"
        hint="Certified data erasure, then donated through the Rayda Impact Program. You get an erasure certificate and an impact report."
      />
      <RadioButton
        value="destroy"
        label="Destroy the device"
        hint="Physically destroyed with a certificate of destruction issued. Nothing is reused or donated."
      />
    </RadioGroup>
  );
}
