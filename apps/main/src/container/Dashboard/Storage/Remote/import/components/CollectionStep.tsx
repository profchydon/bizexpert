"use client";

import { useState } from "react";
import type { DateValue } from "react-aria-components";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { Tabs } from "@/components/application/tabs/tabs";
import type { ImportCollection } from "../types";
import { CollectionEmployeePanel } from "./CollectionEmployeePanel";
import { CustomAddressFields } from "./CustomAddressFields";

interface Props {
  collection: ImportCollection;
  onPatch: (patch: Partial<ImportCollection>) => void;
  country?: string;
}

type Range = { start: DateValue; end: DateValue } | null;

const TABS = [
  { id: "employee", label: "From an employee" },
  { id: "custom", label: "Custom address" },
];

export function CollectionStep({ collection, onPatch, country }: Props) {
  const [mode, setMode] = useState("employee");
  const [range, setRange] = useState<Range>(null);

  const onRange = (value: Range) => {
    setRange(value);
    onPatch({
      window: value
        ? `${value.start.toString()} – ${value.end.toString()}`
        : "",
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Collection details
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Collect from an employee in your directory, or give a custom address.
          Rayda coordinates the pickup.
        </p>
      </div>

      <Tabs selectedKey={mode} onSelectionChange={(k) => setMode(String(k))}>
        <Tabs.List type="button-border" items={TABS} className="self-start">
          {(i) => <Tabs.Item id={i.id}>{i.label}</Tabs.Item>}
        </Tabs.List>
      </Tabs>

      {mode === "employee" ? (
        <CollectionEmployeePanel
          collection={collection}
          country={country}
          onPatch={onPatch}
        />
      ) : (
        <CustomAddressFields collection={collection} onPatch={onPatch} />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">
          Preferred collection window (optional)
        </span>
        <DateRangePicker value={range} onChange={onRange} />
      </div>
    </div>
  );
}
