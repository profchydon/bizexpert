"use client";

import { Check, ChevronDown, ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";

export function ChildRuleStepper({ step }: { step: 1 | 2 }) {
  return (
    <ol className="flex w-full items-center gap-3">
      <StepDot
        active={step === 1}
        complete={step > 1}
        label="1"
        text="Match criteria"
      />
      <div className="h-px flex-1 bg-gray-200" />
      <StepDot
        active={step === 2}
        complete={false}
        label="2"
        text="Rule changes"
      />
    </ol>
  );
}

function StepDot({
  active,
  complete,
  label,
  text,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  text: string;
}) {
  return (
    <li className="flex shrink-0 items-center gap-3">
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-xs font-medium",
          active && "bg-primary-600 text-white",
          complete && "bg-success-600 text-white",
          !active && !complete && "bg-gray-100 text-gray-500",
        )}
      >
        {complete ? <Check className="size-4" /> : label}
      </span>
      <span
        className={cn(
          "text-sm font-normal",
          active ? "text-gray-900" : "text-gray-500",
        )}
      >
        {text}
      </span>
    </li>
  );
}

export function EditorNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <ListFilter
        className="mt-0.5 size-4 shrink-0 text-gray-500"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-sm leading-5 text-gray-500">{children}</p>
      </div>
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-normal text-gray-700">
      {label}
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal text-gray-900 shadow-sm outline-none"
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </span>
    </label>
  );
}
