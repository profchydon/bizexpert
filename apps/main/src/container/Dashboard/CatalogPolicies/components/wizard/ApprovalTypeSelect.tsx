"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, UserCheck, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const approvalOptions = [
  { id: "AUTO", label: "Approve automatically", icon: Zap },
  { id: "REQUIRE", label: "Require approval", icon: UserCheck },
];

const approvalHints = {
  AUTO: "Matching orders are fulfilled immediately without manual sign-off.",
  REQUIRE: "Matching orders wait for sign-off from the designated approver.",
} as const;

export function ApprovalTypeSelect({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">Approval type</span>
      <ApprovalMenu value={value} onChange={onChange} />
      <span className="text-sm text-gray-500">
        {value === undefined
          ? "Select an approval type to continue."
          : approvalHints[value ? "REQUIRE" : "AUTO"]}
      </span>
    </label>
  );
}

function ApprovalMenu({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (value: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedId = value === undefined ? null : value ? "REQUIRE" : "AUTO";
  const selected = approvalOptions.find((option) => option.id === selectedId);
  const SelectedIcon = selected?.icon;

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg bg-white px-3.5 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300 transition",
          open && "ring-2 ring-primary-600",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-2",
            selected ? "text-gray-900" : "text-gray-400",
          )}
        >
          {SelectedIcon ? (
            <SelectedIcon className="size-4 text-gray-400" />
          ) : null}
          <span className={selected ? "font-medium" : undefined}>
            {selected?.label ?? "Select an approval type"}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {approvalOptions.map((option) => {
            const Icon = option.icon;
            const active = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id === "REQUIRE");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-2 py-0.5 text-left"
              >
                <span
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-50",
                    active && "bg-gray-50",
                  )}
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  {active ? (
                    <Check className="ml-auto h-4 w-4 text-primary-600" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
