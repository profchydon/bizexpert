"use client";

import { useState } from "react";
import { ChevronRight, SlashCircle01 } from "@untitledui/icons";
import { Badge, BadgeWithIcon } from "@/components/base/badges/badges";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { formatWithPrefix } from "@/utils/refund-preview";
import type { ScopeLine, ScopePerson } from "./buildCancelScope";
import {
  cancelledBadgeLabel,
  cancelledGroupLabel,
  cancelledTooltip,
  excludedBadgeLabel,
  excludedGroupLabel,
  excludedTooltip,
  plural,
} from "./cancelScopeCopy";

export function DeliveredBadge({ isOffboarding }: { isOffboarding?: boolean }) {
  return (
    <Tooltip title={excludedTooltip(!!isOffboarding)} placement="top">
      <TooltipTrigger className="shrink-0 cursor-default">
        <Badge size="sm" color="success">
          {excludedBadgeLabel(!!isOffboarding)}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );
}

export function CancelledBadge() {
  return (
    <Tooltip title={cancelledTooltip()} placement="top">
      <TooltipTrigger className="shrink-0 cursor-default">
        <BadgeWithIcon size="sm" color="error" iconLeading={SlashCircle01}>
          {cancelledBadgeLabel()}
        </BadgeWithIcon>
      </TooltipTrigger>
    </Tooltip>
  );
}

export function ScopeDeviceRow({
  device,
  prefix,
  forceNote,
  isOffboarding,
  onToggle,
  index = 0,
}: {
  device: ScopeLine;
  prefix: string;
  forceNote?: boolean;
  isOffboarding?: boolean;
  onToggle?: (selected: boolean) => void;
  index?: number;
}) {
  const showNote = !device.excluded && (forceNote || device.spent > 0);
  return (
    <div
      className={cx(
        "flex items-center gap-3 border-t border-secondary py-1.5 first:border-t-0",
        device.excluded && "opacity-60",
      )}
    >
      {onToggle && (
        <Checkbox
          aria-label={
            device.excluded
              ? `Device ${index + 1} cannot be cancelled`
              : `Select device ${index + 1}`
          }
          isSelected={!device.excluded && !!device.selected}
          isDisabled={device.excluded}
          onChange={onToggle}
          size="sm"
          data-testid="scoperows-checkbox"
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs text-secondary">{device.name}</span>
        {showNote && (
          <span className="truncate text-xs text-tertiary">{device.note}</span>
        )}
      </span>
      {device.excluded ? (
        device.exclusionReason === "cancelled" ? (
          <CancelledBadge />
        ) : (
          <DeliveredBadge isOffboarding={isOffboarding} />
        )
      ) : (
        <span className="shrink-0 whitespace-nowrap text-xs font-medium text-primary">
          {formatWithPrefix(device.price, prefix)}
        </span>
      )}
    </div>
  );
}

export function ScopePersonRow({
  person,
  prefix,
  isOffboarding,
  onToggleLine,
}: {
  person: ScopePerson;
  prefix: string;
  isOffboarding?: boolean;
  onToggleLine?: (lineId: string, selected: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-primary">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary"
      >
        <ChevronRight
          className={cx(
            "size-4 shrink-0 text-tertiary transition-transform",
            open && "rotate-90",
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
          {person.name}
        </span>
        <span className="shrink-0 text-xs text-tertiary">{person.meta}</span>
        <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-primary">
          {formatWithPrefix(person.amount, prefix)}
        </span>
      </button>
      {open && (
        <div className="flex flex-col px-3 pb-2 pl-9">
          {person.devices.map((device, index) => (
            <ScopeDeviceRow
              key={device.id}
              device={device}
              prefix={prefix}
              isOffboarding={isOffboarding}
              index={index}
              onToggle={
                onToggleLine
                  ? (selected) => onToggleLine(device.id, selected)
                  : undefined
              }
            />
          ))}
          {person.charges.map((charge) => (
            <ScopeDeviceRow
              key={charge.id}
              device={charge}
              prefix={prefix}
              forceNote
              isOffboarding={isOffboarding}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ScopeGroupHead({
  label,
  count,
}: {
  label: string;
  count: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-secondary px-3 py-1.5">
      <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">
        {label}
      </span>
      <span className="ml-auto text-xs text-tertiary">{count}</span>
    </div>
  );
}

export { cancelledGroupLabel, excludedGroupLabel, plural };
