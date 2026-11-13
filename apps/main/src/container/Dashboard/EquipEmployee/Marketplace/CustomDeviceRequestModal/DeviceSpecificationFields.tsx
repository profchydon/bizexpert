import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addNextDeviceSpecRow, canAddMoreSpecs } from "./deviceSpecRows";
import { SpecField } from "./SpecField";
import { addableSpecTypeOptions } from "./specTypes";
import type { ExtendedSpecRow } from "./types";

const CONDITION_OPTION = [{ label: "Condition", value: "condition" }];

function DeviceSpecificationFields({
  rows,
  onChange,
}: Readonly<{
  rows: ExtendedSpecRow[];
  onChange: (rows: ExtendedSpecRow[]) => void;
}>) {
  const usedKeys = new Set(rows.map((row) => row.key));

  function updateRow(id: string, patch: Partial<ExtendedSpecRow>) {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: string) {
    const target = rows.find((row) => row.id === id);
    if (target?.key === "condition") {
      return;
    }

    onChange(rows.filter((row) => row.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-5">
      <div>
        <p className="text-sm font-semibold text-gray-700">
          Device Specification <span className="text-red-500">*</span>
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          Choose preset specs from the master catalog and enter values.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const isCondition = row.key === "condition";
          const options = isCondition
            ? CONDITION_OPTION
            : addableSpecTypeOptions.filter(
                (option) =>
                  option.value === row.key || !usedKeys.has(option.value),
              );

          const field = (
            <SpecField
              type={row.key}
              value={row.value}
              options={options}
              disabledType={isCondition}
              restrictValue={isCondition}
              onTypeChange={(key) => updateRow(row.id, { key, value: "" })}
              onValueChange={(value) => updateRow(row.id, { value })}
            />
          );

          if (isCondition) {
            return <div key={row.id}>{field}</div>;
          }

          return (
            <div key={row.id} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">{field}</div>
              <button
                type="button"
                aria-label="Remove specification"
                onClick={() => removeRow(row.id)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-50 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {canAddMoreSpecs([...usedKeys]) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-max gap-1.5 text-sm font-semibold text-gray-700"
          onClick={() => onChange(addNextDeviceSpecRow(rows))}
          data-testid="devicespecificationfields-button"
        >
          <Plus className="size-4" />
          Add Specification
        </Button>
      )}
    </div>
  );
}

export { DeviceSpecificationFields };
