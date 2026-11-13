"use client";

import type { RefAttributes } from "react";
import { DotsVertical } from "@untitledui/icons";
import type {
  ButtonProps as AriaButtonProps,
  MenuProps as AriaMenuProps,
  PopoverProps as AriaPopoverProps,
  SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaSeparator,
} from "react-aria-components";
import { cx } from "@/utils/cx";
import { DropdownItem } from "./dropdown-item";

interface DropdownMenuProps<T extends object> extends AriaMenuProps<T> {}

const DropdownMenu = <T extends object>(props: DropdownMenuProps<T>) => {
  return (
    <AriaMenu
      disallowEmptySelection
      selectionMode="single"
      {...props}
      className={(state) =>
        cx(
          "h-min overflow-y-auto py-1 outline-hidden select-none",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    />
  );
};

interface DropdownPopoverProps extends AriaPopoverProps {}

const DropdownPopover = (props: DropdownPopoverProps) => {
  return (
    <AriaPopover
      placement="bottom right"
      {...props}
      className={(state) =>
        cx(
          "!max-h-none w-62 origin-(--trigger-anchor-point) overflow-visible rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt will-change-transform",
          state.isEntering &&
            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
          state.isExiting &&
            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      {props.children}
    </AriaPopover>
  );
};

const DropdownSeparator = (props: AriaSeparatorProps) => {
  return (
    <AriaSeparator
      {...props}
      className={cx("my-1 h-px w-full bg-border-secondary", props.className)}
    />
  );
};

const DropdownDotsButton = (
  props: AriaButtonProps & RefAttributes<HTMLButtonElement>,
) => {
  return (
    <AriaButton
      {...props}
      aria-label="Open menu"
      className={(state) =>
        cx(
          "cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear",
          (state.isPressed || state.isHovered) && "text-fg-quaternary_hover",
          (state.isPressed || state.isFocusVisible) &&
            "outline-2 outline-offset-2",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      <DotsVertical className="size-5 transition-inherit-all" />
    </AriaButton>
  );
};

export const Dropdown = {
  Root: AriaMenuTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Section: AriaMenuSection,
  SectionHeader: AriaHeader,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  DotsButton: DropdownDotsButton,
};

export type { DropdownItemProps } from "./dropdown-item";
