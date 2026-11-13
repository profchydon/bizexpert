"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isDeviceCount, nextDeviceCount } from "../../lib/deviceCount";

export function DeviceCountField({
  index,
  question,
  value,
  showError,
  onAnswer,
}: {
  index: number;
  question: string;
  value: string;
  showError: boolean;
  onAnswer: (value: string) => void;
}) {
  const valid = isDeviceCount(value);
  const errored = showError && !valid;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
            valid
              ? "bg-primary-600 text-white"
              : errored
                ? "bg-error-600 text-white"
                : "text-gray-400 opacity-50",
          )}
        >
          {valid ? <Check className="size-3.5" /> : index + 1}
        </span>
        <p
          className={cn(
            "text-base font-semibold transition-colors duration-200",
            errored ? "text-error-600" : "text-gray-900",
          )}
        >
          {question}
        </p>
      </div>
      <div className="max-w-xs pl-10">
        <Input
          inputMode="numeric"
          autoComplete="off"
          placeholder="1"
          value={value}
          aria-invalid={errored}
          onChange={(event) =>
            onAnswer(nextDeviceCount(value, event.target.value))
          }
          data-testid="devicecountfield-input"
        />
        {errored && (
          <p className="mt-1 text-xs text-error-600">
            Enter a number from 1 to 100,000.
          </p>
        )}
      </div>
    </div>
  );
}
