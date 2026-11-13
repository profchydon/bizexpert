"use client";

import type { FC, SVGProps } from "react";
import { XClose } from "@untitledui/icons";
import { Button, type ButtonProps } from "@/components/base/buttons/button";

export interface BulkAction {
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  color: ButtonProps["color"];
  onClick: () => void;
  isDisabled?: boolean;
}

export function BulkActionBar({
  count,
  note,
  actions,
  onClear,
}: {
  count: number;
  note?: string;
  actions: BulkAction[];
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary bg-brand-primary_alt px-5 py-2.5">
      <span className="text-sm font-semibold text-primary">
        {count} selected
        {note ? (
          <span className="font-normal text-tertiary"> · {note}</span>
        ) : null}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="sm"
            color={action.color}
            iconLeading={action.icon}
            isDisabled={action.isDisabled}
            onClick={action.onClick}
            data-testid="bulk-action-bar-button"
          >
            {action.label}
          </Button>
        ))}
        <Button
          size="sm"
          color="link-gray"
          iconLeading={XClose}
          onClick={onClear}
          data-testid="bulk-action-bar-button-2"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
