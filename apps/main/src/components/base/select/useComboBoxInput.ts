import { useCallback, useEffect, useRef, useState } from "react";
import type { Key } from "react-aria-components";
import type { SelectItemType } from "@/components/base/select/select";
import { shouldResetComboBoxQueryOnOpen } from "./comboBoxQuery";

type Options = {
  items?: SelectItemType[];
  selectedKey?: Key | null;
  defaultSelectedKey?: Key | null;
  onSearchChange?: (value: string) => void;
  onSelectionChange?: (key: Key | null) => void;
  onOpenChange?: (open: boolean) => void;
};

export function useComboBoxInput({
  items,
  selectedKey,
  defaultSelectedKey,
  onSearchChange,
  onSelectionChange,
  onOpenChange,
}: Options) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputValueRef = useRef("");

  const setQuery = (value: string) => {
    inputValueRef.current = value;
    setInputValue(value);
  };

  // Track the selected item's label so we can put it back into the input when the menu
  // closes — this discards any unmatched typing (e.g. "ng") and leaves the field filled
  // with the real selected value, never a stray/invalid string.
  const labelForKey = (key: Key | null | undefined) =>
    key == null
      ? ""
      : (items?.find((item) => String(item.id) === String(key))?.label ?? "");
  const selectedLabelRef = useRef(
    labelForKey(selectedKey ?? defaultSelectedKey),
  );
  // Keep in sync when a controlled selectedKey is changed from outside (e.g. currency set by country).
  if (selectedKey !== undefined)
    selectedLabelRef.current = labelForKey(selectedKey);

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      const label = labelForKey(key);
      selectedLabelRef.current = label;
      // Show the chosen label immediately (react-aria leaves the typed fragment in a
      // controlled input on select).
      setQuery(label);
      onSelectionChange?.(key);
    },
    [items, onSelectionChange],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (
        open &&
        shouldResetComboBoxQueryOnOpen(
          inputValueRef.current,
          selectedLabelRef.current,
        )
      ) {
        setQuery("");
        onSearchChange?.("");
      }
      onOpenChange?.(open);
    },
    [onOpenChange, onSearchChange],
  );

  // While the field is NOT focused, keep the input text equal to the selected value's
  // label. This fills the field with the real value, discards unmatched typing on blur
  // (e.g. "ng"), and reflects programmatic changes (currency set by country). It only runs
  // when unfocused, so it never re-triggers the menu open while interacting — react-aria
  // manages the input text itself during typing/selection.
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  useEffect(() => {
    if (isFocused) return;
    setInputValue((prev) => {
      const next =
        prev === selectedLabelRef.current ? prev : selectedLabelRef.current;
      inputValueRef.current = next;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, isFocused]);

  return {
    inputValue,
    isOpen,
    handleInputChange,
    handleOpenChange,
    handleSelectionChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
}
