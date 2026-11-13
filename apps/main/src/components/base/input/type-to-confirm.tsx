"use client";

import { useState } from "react";
import { Input } from "@/components/base/input/input";

const normalize = (value: string) => value.trim().toLowerCase();

export function confirmMatches(value: string, target: string): boolean {
  const goal = normalize(target);
  return goal.length > 0 && normalize(value) === goal;
}

interface Props {
  target: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  matchHint?: string;
  errorHint?: string;
  size?: "sm" | "md";
}

export function TypeToConfirm({
  target,
  value,
  onChange,
  label,
  hint,
  matchHint,
  errorHint,
  size = "sm",
}: Props) {
  const [left, setLeft] = useState(false);
  const typed = normalize(value);
  const goal = normalize(target);
  const matches = confirmMatches(value, target);
  const couldStillMatch = goal.startsWith(typed);
  const isInvalid = typed.length > 0 && !matches && (!couldStillMatch || left);

  return (
    <Input
      size={size}
      label={label ?? `Type ${target} to confirm`}
      placeholder={target}
      value={value}
      onChange={(next) => {
        if (goal.startsWith(normalize(next))) setLeft(false);
        onChange(next);
      }}
      onBlur={() => setLeft(true)}
      isInvalid={isInvalid}
      hint={
        isInvalid
          ? (errorHint ?? "That does not match.")
          : matches
            ? matchHint
            : hint
      }
      autoComplete="off"
      spellCheck="false"
      data-testid="type-to-confirm-input"
    />
  );
}
