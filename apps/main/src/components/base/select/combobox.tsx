"use client";

import type { FC, ReactNode, RefAttributes } from "react";
import { useCallback, useRef, useState } from "react";
import type {
  ComboBoxProps as AriaComboBoxProps,
  ListBoxProps as AriaListBoxProps,
} from "react-aria-components";
import {
  ComboBox as AriaComboBox,
  ListBox as AriaListBox,
} from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { ComboBoxValue } from "@/components/base/select/combobox-value";
import { Popover } from "@/components/base/select/popover";
import {
  type CommonProps,
  SelectContext,
  type SelectItemType,
  sizes,
} from "@/components/base/select/select";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useComboBoxInput } from "./useComboBoxInput";

interface ComboBoxProps
  extends
    Omit<AriaComboBoxProps<SelectItemType>, "children" | "items">,
    RefAttributes<HTMLDivElement>,
    CommonProps {
  shortcut?: boolean;
  items?: SelectItemType[];
  popoverClassName?: string;
  shortcutClassName?: string;
  groupClassName?: string;
  noFocusRing?: boolean;
  hideSelectedSupportingText?: boolean;
  icon?: FC | ReactNode;
  onSearchChange?: (value: string) => void;
  children: AriaListBoxProps<SelectItemType>["children"];
}

export const ComboBox = ({
  placeholder = "Search",
  shortcut = true,
  size = "sm",
  children,
  items,
  shortcutClassName,
  groupClassName,
  noFocusRing,
  hideSelectedSupportingText,
  icon,
  onSearchChange,
  ...otherProps
}: ComboBoxProps) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState("");
  const {
    inputValue,
    isOpen,
    handleInputChange,
    handleOpenChange,
    handleSelectionChange,
    onFocus,
    onBlur,
  } = useComboBoxInput({
    items,
    selectedKey: otherProps.selectedKey,
    defaultSelectedKey: otherProps.defaultSelectedKey,
    onSearchChange,
    onSelectionChange: otherProps.onSelectionChange,
    onOpenChange: otherProps.onOpenChange,
  });

  // Resize observer for popover width
  const onResize = useCallback(() => {
    if (!placeholderRef.current) return;

    const divRect = placeholderRef.current?.getBoundingClientRect();

    setPopoverWidth(divRect.width + "px");
  }, [placeholderRef, setPopoverWidth]);

  useResizeObserver({
    ref: placeholderRef,
    box: "border-box",
    onResize,
  });

  return (
    <SelectContext.Provider value={{ size }}>
      <AriaComboBox
        menuTrigger="focus"
        {...otherProps}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onOpenChange={handleOpenChange}
        onSelectionChange={handleSelectionChange}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {(state) => (
          <div className="flex flex-col gap-1.5">
            {otherProps.label && (
              <Label isRequired={state.isRequired} tooltip={otherProps.tooltip}>
                {otherProps.label}
              </Label>
            )}

            <ComboBoxValue
              ref={placeholderRef}
              placeholder={placeholder}
              shortcut={shortcut}
              shortcutClassName={shortcutClassName}
              groupClassName={groupClassName}
              noFocusRing={noFocusRing}
              hideSelectedSupportingText={hideSelectedSupportingText}
              icon={icon}
              size={size}
              isOpen={isOpen}
              // This is a workaround to correctly calculating the trigger width
              // while using ResizeObserver wasn't 100% reliable.
              onFocus={onResize}
              onPointerEnter={onResize}
            />

            <Popover
              size={size}
              triggerRef={placeholderRef}
              style={{ width: popoverWidth }}
              className={otherProps.popoverClassName}
            >
              <AriaListBox items={items} className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>

            {otherProps.hint && (
              <HintText isInvalid={state.isInvalid}>{otherProps.hint}</HintText>
            )}
          </div>
        )}
      </AriaComboBox>
    </SelectContext.Provider>
  );
};
