"use client";

import type { ServerOfficeArea } from "@/types/offices";
import { OfficeAreaSelect } from "./OfficeAreaSelect";

interface Props {
  areas: ServerOfficeArea[];
  value: string;
  onChange: (value: string) => void;
  onAddArea: () => void;
}

export function OfficeAreaField({ areas, value, onChange, onAddArea }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <OfficeAreaSelect areas={areas} value={value} onChange={onChange} />
      {areas.length === 0 && (
        <button
          type="button"
          className="self-start text-sm font-semibold text-primary-700 hover:text-primary-800"
          onClick={onAddArea}
          data-testid="officeareafield-add-area"
        >
          Add office area
        </button>
      )}
    </div>
  );
}
