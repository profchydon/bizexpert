"use client";

import { Package, ScanLine } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { CatalogRule } from "../../types";

export function WizardBasics({
  draft,
  nameError,
  onChange,
}: {
  draft: CatalogRule;
  nameError: boolean;
  onChange: (rule: CatalogRule) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">
          Catalog policy name
        </span>
        <Input
          placeholder="e.g. Senior Engineers — Nigeria"
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          maxLength={80}
          className="mt-1.5 h-10 rounded-lg border-gray-300 text-sm placeholder:text-gray-400"
          data-testid="basicsstep-input"
        />
        {nameError ? (
          <span className="mt-1.5 block text-sm text-error-700">
            Rule name is required.
          </span>
        ) : null}
      </label>
      <Divider />
      <ToggleCard
        checked={draft.triggerType === "HRIS"}
        title="HRIS sync"
        description="Automatically sync with the HRIS and trigger this rule when a new employee is added, based on their start date."
        onClick={() =>
          onChange({
            ...draft,
            triggerType: draft.triggerType === "HRIS" ? "MANUAL" : "HRIS",
          })
        }
      />
      <Divider />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-700">Selection mode</p>
          <p className="text-sm text-gray-500">
            How employees receive their devices under this policy.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ModeCard
            selected={draft.selectionMode === "FIXED"}
            icon={<Package className="h-5 w-5" />}
            title="Fixed kit"
            description="Employee gets the exact items in the assigned kit."
            onClick={() => onChange({ ...draft, selectionMode: "FIXED" })}
          />
          <ModeCard
            selected={draft.selectionMode === "OPEN"}
            icon={<ScanLine className="h-5 w-5" />}
            title="Open catalog"
            description="Employee picks from an approved catalog within budget."
            onClick={() => onChange({ ...draft, selectionMode: "OPEN" })}
          />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full shrink-0 bg-gray-200" />;
}

function ToggleCard({
  checked,
  title,
  description,
  onClick,
}: {
  checked: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2 rounded-xl border p-4 text-left transition",
        checked
          ? "border-primary-600 bg-primary-50"
          : "border-gray-200 bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition",
          checked ? "bg-primary-600" : "bg-gray-100",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm leading-5 text-gray-500">{description}</span>
      </span>
    </button>
  );
}

function ModeCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition",
        selected && "border-primary-600 bg-primary-50 ring-1 ring-primary-600",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-white",
          selected
            ? "border-primary-300 text-primary-700"
            : "border-gray-200 text-gray-500",
        )}
      >
        {icon}
      </span>
      <span className="pr-8">
        <span
          className={cn(
            "block text-sm font-semibold",
            selected ? "text-primary-700" : "text-gray-900",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-sm leading-5",
            selected ? "text-primary-700" : "text-gray-500",
          )}
        >
          {description}
        </span>
      </span>
      <span
        className={cn(
          "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border",
          selected ? "border-primary-600" : "border-gray-300",
        )}
      >
        {selected ? (
          <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
        ) : null}
      </span>
    </button>
  );
}
