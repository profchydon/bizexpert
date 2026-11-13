"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "@/utils/cx";

interface RadioCardGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

export const RadioCardGroup = ({
  children,
  className,
  columns = 2,
  ...props
}: RadioCardGroupProps) => (
  <AriaRadioGroup
    {...props}
    className={cx("grid gap-3", columnClasses[columns], className)}
  >
    {children}
  </AriaRadioGroup>
);
RadioCardGroup.displayName = "RadioCardGroup";

type RadioCardIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface RadioCardProps extends Omit<
  AriaRadioProps,
  "children" | "className"
> {
  icon?: RadioCardIcon;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const RadioCard = ({
  icon: Icon,
  label,
  description,
  className,
  ...ariaProps
}: RadioCardProps) => (
  <AriaRadio
    {...ariaProps}
    className={(renderProps) =>
      cx(
        "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-secondary bg-primary p-4 transition",
        "hover:border-tertiary",
        renderProps.isSelected &&
          "border-brand-solid bg-brand-primary ring-1 ring-brand-solid",
        renderProps.isFocusVisible &&
          "outline-2 outline-offset-2 outline-focus-ring",
        renderProps.isDisabled && "cursor-not-allowed opacity-60",
        className,
      )
    }
  >
    {({ isSelected, isDisabled, isFocusVisible }) => (
      <>
        {Icon ? (
          <span
            className={cx(
              "flex size-9 shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary text-fg-secondary transition",
              isSelected && "border-brand bg-primary text-fg-brand-primary",
            )}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-8">
          <p
            className={cx(
              "text-sm font-semibold select-none",
              isSelected ? "text-brand-secondary" : "text-primary",
            )}
          >
            {label}
          </p>
          {description ? (
            <p
              className={cx(
                "text-sm",
                isSelected ? "text-brand-secondary" : "text-tertiary",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        <RadioButtonBase
          className="absolute top-4 right-4"
          isSelected={isSelected}
          isDisabled={isDisabled}
          isFocusVisible={isFocusVisible}
        />
      </>
    )}
  </AriaRadio>
);
RadioCard.displayName = "RadioCard";
