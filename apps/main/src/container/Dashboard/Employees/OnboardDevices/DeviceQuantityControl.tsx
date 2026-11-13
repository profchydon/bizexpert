"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseQuantityInput } from "./equipItems";

interface Props {
  quantity: number;
  onChange: (quantity: number) => void;
}

const DeviceQuantityControl: React.FC<Props> = ({ quantity, onChange }) => {
  const [draft, setDraft] = useState(String(quantity));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setDraft(String(quantity));
  }, [quantity, isEditing]);

  const commit = (raw: string) => {
    const next = parseQuantityInput(raw, quantity);
    setDraft(String(next));
    setIsEditing(false);
    if (next !== quantity) onChange(next);
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        className="h-8 w-8 shrink-0 rounded-md p-0"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        data-testid="devicequantitycontrol-button"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Quantity"
        className={cn(
          "h-8 w-10 shrink-0 rounded-md border border-gray-200 bg-white",
          "text-center text-sm tabular-nums text-gray-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        )}
        value={draft}
        onFocus={() => setIsEditing(true)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        data-testid="devicequantitycontrol-input"
      />
      <Button
        type="button"
        variant="outline"
        className="h-8 w-8 shrink-0 rounded-md p-0"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        data-testid="devicequantitycontrol-button-2"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DeviceQuantityControl;
