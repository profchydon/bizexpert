"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuestionOption } from "../../lib/types";
import { OptionChip } from "./OptionChip";

export function QuestionBlock({
  question,
  options,
  multiSelect,
  exclusiveOptions,
  answer,
  onAnswer,
  index,
  showError,
}: {
  question: string;
  options: readonly QuestionOption[];
  multiSelect: boolean;
  exclusiveOptions?: readonly string[];
  answer: string | string[];
  onAnswer: (value: string | string[]) => void;
  index: number;
  showError?: boolean;
}) {
  const hasAnswer = Array.isArray(answer) ? answer.length > 0 : answer !== "";
  const isErrored = showError && !hasAnswer;

  function isSelected(option: string) {
    return Array.isArray(answer) ? answer.includes(option) : answer === option;
  }

  function toggle(option: string) {
    if (!multiSelect) {
      onAnswer(option);
      return;
    }

    const current = Array.isArray(answer) ? answer : [];
    if (current.includes(option)) {
      onAnswer(current.filter((value) => value !== option));
      return;
    }
    if (exclusiveOptions?.includes(option)) {
      onAnswer([option]);
      return;
    }
    onAnswer([
      ...current.filter((value) => !exclusiveOptions?.includes(value)),
      option,
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
            hasAnswer
              ? "bg-primary-600 text-white"
              : isErrored
                ? "bg-error-600 text-white"
                : "text-gray-400 opacity-50",
          )}
        >
          {hasAnswer ? <Check className="size-3.5" /> : index + 1}
        </span>
        <div className="flex-1">
          <p
            className={cn(
              "text-base font-semibold transition-colors duration-200",
              isErrored ? "text-error-600" : "text-gray-900",
            )}
          >
            {question}
          </p>
          {multiSelect && (
            <p className="mt-0.5 text-xs text-gray-500">
              Select all that apply
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pl-10">
        {options.map((option) => (
          <OptionChip
            key={option.value}
            label={option.label}
            selected={isSelected(option.value)}
            multiSelect={multiSelect}
            onClick={() => toggle(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
