"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import type { NumberFieldProps as AriaNumberFieldProps } from "react-aria-components";
import {
  Button as AriaButton,
  Group as AriaGroup,
  Input as AriaInput,
  NumberField as AriaNumberField,
} from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";

interface InputNumberProps extends Omit<AriaNumberFieldProps, "className"> {
  label?: string;
  hint?: ReactNode;
  placeholder?: string;
  size?: "sm" | "md";
  className?: string;
}

export const InputNumber = ({
  label,
  hint,
  placeholder,
  size = "sm",
  className,
  ...props
}: InputNumberProps) => {
  return (
    <AriaNumberField
      {...props}
      className={cx(
        "group flex h-max w-full flex-col items-start justify-start gap-1.5",
        className,
      )}
    >
      {({ isInvalid, isDisabled, isRequired }) => (
        <>
          {label && <Label isRequired={isRequired}>{label}</Label>}

          <AriaGroup
            className={cx(
              "relative flex w-full items-stretch overflow-hidden rounded-lg bg-primary shadow-xs ring-1 ring-border-primary transition-all duration-100 ease-linear ring-inset",
              "focus-within:ring-2 focus-within:ring-border-brand",
              isInvalid &&
                "ring-border-error_subtle focus-within:ring-border-error",
              isDisabled && "ring- cursor-not-allowed opacity-50",
            )}
          >
            <AriaInput
              placeholder={placeholder}
              className={cx(
                "min-w-0 flex-1 bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder",
                size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5",
                isDisabled && "placeholder: cursor-not-allowed",
              )}
            />

            <div className="flex shrink-0 flex-col self-stretch border-l border-secondary">
              <AriaButton
                slot="increment"
                aria-label="Increase value"
                className="disabled: flex flex-1 items-center justify-center px-2 text-tertiary outline-hidden transition hover:bg-primary_hover hover:text-secondary disabled:cursor-not-allowed"
              >
                <ChevronUp className="size-3" />
              </AriaButton>
              <AriaButton
                slot="decrement"
                aria-label="Decrease value"
                className="disabled: flex flex-1 items-center justify-center border-t border-secondary px-2 text-tertiary outline-hidden transition hover:bg-primary_hover hover:text-secondary disabled:cursor-not-allowed"
              >
                <ChevronDown className="size-3" />
              </AriaButton>
            </div>
          </AriaGroup>

          {hint && <HintText isInvalid={isInvalid}>{hint}</HintText>}
        </>
      )}
    </AriaNumberField>
  );
};

InputNumber.displayName = "InputNumber";
