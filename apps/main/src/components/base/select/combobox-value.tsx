"use client";

import type {
  FC,
  FocusEventHandler,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";
import { createElement, isValidElement, useContext } from "react";
import { ChevronDown, SearchLg as SearchIcon } from "@untitledui/icons";
import type { GroupProps as AriaGroupProps } from "react-aria-components";
import {
  Group as AriaGroup,
  Input as AriaInput,
  ComboBoxStateContext,
} from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { type SelectItemType, sizes } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

interface ComboBoxValueProps extends AriaGroupProps {
  size: "sm" | "md";
  shortcut: boolean;
  placeholder?: string;
  shortcutClassName?: string;
  groupClassName?: string;
  noFocusRing?: boolean;
  icon?: FC | ReactNode;
  isOpen?: boolean;
  // Hide the selected item's supporting text in the trigger only (the dropdown still shows it).
  hideSelectedSupportingText?: boolean;
  onFocus?: FocusEventHandler;
  onPointerEnter?: PointerEventHandler;
  ref?: RefObject<HTMLDivElement | null>;
}

export const ComboBoxValue = ({
  size,
  shortcut,
  placeholder,
  shortcutClassName,
  groupClassName,
  noFocusRing,
  icon,
  isOpen,
  hideSelectedSupportingText,
  ...otherProps
}: ComboBoxValueProps) => {
  const state = useContext(ComboBoxStateContext);

  const value = (state?.selectedItem?.value as SelectItemType | null) || null;
  const inputValue = state?.inputValue || null;
  const selectedLabel = value?.label || null;

  const showSelectedOverlay = !isOpen && !inputValue && selectedLabel;
  const showTypeaheadOverlay = isOpen && inputValue;

  const first =
    (value?.supportingText
      ? inputValue?.split(value.supportingText)?.[0]
      : inputValue) || "";
  const last = first ? inputValue?.split(first)[1] : undefined;

  return (
    <AriaGroup
      {...otherProps}
      className={({ isFocusWithin, isDisabled }) =>
        cx(
          "relative flex w-full items-center gap-2 rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition-shadow duration-100 ease-linear ring-inset",
          isDisabled && "cursor-not-allowed opacity-50",
          (isFocusWithin || isOpen) && !noFocusRing && "ring-2 ring-brand",
          sizes[size].root,
          groupClassName,
        )
      }
    >
      {({ isDisabled }) => (
        <>
          {value?.avatarUrl || value?.initials ? (
            <Avatar
              size="xs"
              src={value.avatarUrl}
              initials={value.initials}
              alt={value.label}
              aria-hidden="true"
            />
          ) : icon === null ? null : icon ? (
            isReactComponent(icon) ? (
              createElement(icon as FC<{ className?: string }>, {
                className:
                  "pointer-events-none size-5 shrink-0 text-fg-quaternary",
              })
            ) : isValidElement(icon) ? (
              icon
            ) : null
          ) : (
            <SearchIcon className="pointer-events-none size-5 shrink-0 text-fg-quaternary" />
          )}

          <div className="relative flex w-full items-center gap-2">
            {showSelectedOverlay && (
              <span
                className="absolute top-1/2 z-0 inline-flex w-full -translate-y-1/2 gap-2 truncate"
                aria-hidden="true"
              >
                <p
                  className={cx(
                    "truncate text-md font-medium text-primary",
                    isDisabled && "",
                  )}
                >
                  {selectedLabel}
                </p>
                {value?.supportingText && !hideSelectedSupportingText && (
                  <p
                    className={cx(
                      "truncate text-md text-tertiary",
                      isDisabled && "",
                    )}
                  >
                    {value.supportingText}
                  </p>
                )}
              </span>
            )}

            {showTypeaheadOverlay && (
              <span
                className="absolute top-1/2 z-0 inline-flex w-full -translate-y-1/2 gap-2 truncate"
                aria-hidden="true"
              >
                <p
                  className={cx(
                    "text-md font-medium text-primary",
                    isDisabled && "",
                  )}
                >
                  {first}
                </p>
                {last && (
                  <p
                    className={cx(
                      "-ml-0.75 text-md text-tertiary",
                      isDisabled && "",
                    )}
                  >
                    {last}
                  </p>
                )}
              </span>
            )}

            <AriaInput
              placeholder={showSelectedOverlay ? "" : placeholder}
              className={cx(
                "disabled: disabled:placeholder: z-10 w-full appearance-none bg-transparent text-md font-medium caret-alpha-black/90 outline-hidden placeholder:font-normal placeholder:text-placeholder disabled:cursor-not-allowed",
                showSelectedOverlay || showTypeaheadOverlay
                  ? "text-transparent"
                  : "text-primary",
              )}
            />
          </div>

          <ChevronDown
            aria-hidden="true"
            className={cx(
              "ml-auto shrink-0 text-fg-quaternary",
              size === "sm" ? "size-4 stroke-[2.5px]" : "size-5",
            )}
          />

          {shortcut && (
            <div
              className={cx(
                "absolute inset-y-0.5 right-0.5 z-10 flex items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8",
                sizes[size].shortcut,
                shortcutClassName,
              )}
            >
              <span
                className={cx(
                  "pointer-events-none rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset",
                  isDisabled && "bg-transparent",
                )}
                aria-hidden="true"
              >
                ⌘K
              </span>
            </div>
          )}
        </>
      )}
    </AriaGroup>
  );
};
