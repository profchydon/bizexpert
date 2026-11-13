"use client";

import { Plus, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export interface ExtendedSpecRow {
  id: string;
  key: string;
  value: string;
}

interface Props {
  rows: ExtendedSpecRow[];
  onChange: (rows: ExtendedSpecRow[]) => void;
}

function generateRowId(existing: ExtendedSpecRow[]): string {
  const nums = existing
    .map((r) => Number(r.id))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1);
}

export function ExtendedSpecsList({ rows, onChange }: Props) {
  function updateRow(id: string, patch: Partial<ExtendedSpecRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }
  function addRow() {
    onChange([...rows, { id: generateRowId(rows), key: "", value: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h4 className="text-sm font-semibold text-secondary">
            Additional Spec
          </h4>
          <p className="text-xs text-tertiary">
            For anything not in the structured fields above.
          </p>
        </div>
        <Button
          color="link-color"
          size="sm"
          iconLeading={Plus}
          onClick={addRow}
          className="shrink-0"
          data-testid="extendedspecslist-button"
        >
          Add spec
        </Button>
      </div>
      {rows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="group grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2"
            >
              <Input
                placeholder="Label (e.g. Keyboard layout)"
                size="sm"
                value={row.key}
                onChange={(next) => updateRow(row.id, { key: next })}
                data-testid="extendedspecslist-input"
              />
              <Input
                placeholder="Value (e.g. US ANSI)"
                size="sm"
                value={row.value}
                onChange={(next) => updateRow(row.id, { value: next })}
                data-testid="extendedspecslist-input-2"
              />
              <Button
                color="tertiary"
                size="sm"
                iconLeading={<Trash01 data-icon />}
                onClick={() => removeRow(row.id)}
                aria-label="Remove spec"
                className="opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                data-testid="extendedspecslist-button-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
