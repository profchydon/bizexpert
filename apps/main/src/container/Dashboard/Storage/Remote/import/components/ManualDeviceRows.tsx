"use client";

import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { type ImportRow, createEmptyRow } from "../types";
import { ImportDeviceCard } from "./ImportDeviceCard";

interface Props {
  rows: ImportRow[];
  issues: Map<string, string[]>;
  onChange: (rows: ImportRow[]) => void;
}

export function ManualDeviceRows({ rows, issues, onChange }: Props) {
  const update = (id: string, updated: ImportRow) =>
    onChange(rows.map((r) => (r.id === id ? updated : r)));
  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));
  const add = () =>
    onChange([
      ...rows,
      createEmptyRow(`m-${Date.now().toString(36)}-${rows.length}`),
    ]);

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && (
        <p className="text-sm text-tertiary">
          No devices yet. Add one below or switch to CSV upload.
        </p>
      )}
      {rows.map((r) => (
        <ImportDeviceCard
          key={r.id}
          device={r}
          errors={issues.get(r.id)}
          defaultOpen={!r.assetType}
          onChange={(u) => update(r.id, u)}
          onRemove={() => remove(r.id)}
        />
      ))}
      <Button
        size="sm"
        color="secondary"
        iconLeading={Plus}
        onClick={add}
        className="self-start"
        data-testid="manualdevicerows-button"
      >
        Add device
      </Button>
    </div>
  );
}
