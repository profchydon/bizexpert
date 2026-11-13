"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServerOfficeArea } from "@/types/offices";
import {
  officeModalFieldHintClass,
  officeModalSelectTriggerClass,
} from "./officeModalFieldClasses";

export const NO_AREA_VALUE = "no-area";

interface Props {
  areas: ServerOfficeArea[];
  value: string;
  onChange: (value: string) => void;
}

export function OfficeAreaSelect({ areas, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-gray-700">Office area</Label>
      <Select
        value={value}
        onValueChange={onChange}
        data-testid="officeareaselect-select"
      >
        <SelectTrigger className={officeModalSelectTriggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_AREA_VALUE}>No specific area</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area.id} value={area.id}>
              {area.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className={officeModalFieldHintClass}>
        Where these devices sit inside the office.
      </p>
    </div>
  );
}
