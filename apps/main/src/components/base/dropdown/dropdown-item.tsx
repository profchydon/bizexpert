"use client";

import type { FC, ReactNode } from "react";
import { Check } from "@untitledui/icons";
import type { MenuItemProps as AriaMenuItemProps } from "react-aria-components";
import { MenuItem as AriaMenuItem } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { cx } from "@/utils/cx";

export interface DropdownItemProps extends AriaMenuItemProps {
  label?: string;
  addon?: string;
  unstyled?: boolean;
  icon?: FC<{ className?: string }>;
  leading?: ReactNode;
  avatarUrl?: string;
  initials?: string;
  selectionIndicator?: "checkmark" | "radio";
  disabledReason?: string | null;
}

export const DropdownItem = ({
  label,
  children,
  addon,
  icon: Icon,
  leading,
  avatarUrl,
  initials,
  selectionIndicator,
  unstyled,
  disabledReason,
  ...props
}: DropdownItemProps) => {
  if (unstyled) {
    return (
      <AriaMenuItem id={label} textValue={label} {...props}>
        {children}
      </AriaMenuItem>
    );
  }

  return (
    <DisabledWithTooltip
      isDisabled={Boolean(props.isDisabled)}
      reason={disabledReason}
      triggerClassName="block w-full"
    >
      <AriaMenuItem
        {...props}
        className={(state) =>
          cx(
            "group block cursor-pointer px-1.5 py-px outline-hidden",
            state.isDisabled && "cursor-not-allowed",
            typeof props.className === "function"
              ? props.className(state)
              : props.className,
          )
        }
      >
        {(state) => (
          <div
            className={cx(
              "relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear",
              !state.isDisabled && "group-hover:bg-primary_hover",
              (state.isFocused || (!!selectionIndicator && state.isSelected)) &&
                "bg-primary_hover",
              state.isFocusVisible && "outline-2 -outline-offset-2",
            )}
          >
            {leading ? (
              <span className="mr-2 flex shrink-0 items-center">{leading}</span>
            ) : avatarUrl || initials ? (
              <span className="mr-2 flex shrink-0 items-center">
                <Avatar
                  aria-hidden="true"
                  size="xs"
                  src={avatarUrl}
                  initials={initials}
                  alt={label}
                />
              </span>
            ) : Icon ? (
              <Icon
                aria-hidden="true"
                className={cx(
                  "mr-2 size-4 shrink-0 stroke-[2.25px]",
                  state.isDisabled ? "" : "text-fg-quaternary",
                )}
              />
            ) : null}

            <span
              className={cx(
                "grow truncate text-sm font-semibold",
                state.isDisabled ? "" : "text-secondary",
                state.isFocused && "text-secondary_hover",
              )}
            >
              {label ||
                (typeof children === "function" ? children(state) : children)}
            </span>

            {addon && (
              <span
                className={cx(
                  "ml-3 shrink-0 rounded px-1 py-px text-xs font-medium ring-1 ring-secondary ring-inset",
                  state.isDisabled ? "" : "text-quaternary",
                )}
              >
                {addon}
              </span>
            )}

            {selectionIndicator === "checkmark" && state.isSelected && (
              <Check
                aria-hidden="true"
                className="ml-auto size-5 text-fg-brand-primary"
              />
            )}
            {selectionIndicator === "radio" &&
              (state.isSelected ? (
                <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-solid">
                  <span className="size-1.5 rounded-full bg-white" />
                </span>
              ) : (
                <span className="ml-auto size-4 shrink-0 rounded-full ring-1 ring-secondary ring-inset" />
              ))}
          </div>
        )}
      </AriaMenuItem>
    </DisabledWithTooltip>
  );
};
