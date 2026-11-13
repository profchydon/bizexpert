"use client";

import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function PolicyNameField({
  value,
  error,
  onChange,
}: {
  value: string;
  error: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Catalog policy name
      </label>
      <Input
        value={value}
        maxLength={80}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. Senior Engineers - Nigeria"
        data-testid="editpolicyfields-input"
      />
      {error ? (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          Rule name is required.
        </p>
      ) : null}
    </div>
  );
}

export function TriggerSyncCard({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition",
        checked
          ? "border-primary-300 bg-primary-50"
          : "border-gray-200 hover:border-gray-300",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">HRIS sync</p>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            Automatically sync with the HRIS and trigger this rule when a new
            employee is added, based on their start date.
          </p>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}
