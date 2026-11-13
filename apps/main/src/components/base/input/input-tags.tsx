"use client";

import { type ReactNode, useRef, useState } from "react";
import { ChevronDown, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Check } from "@untitledui/icons";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  type Key,
} from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";

export interface TagOption {
  id: string;
  label: string;
  leading?: ReactNode;
}

interface InputTagsProps {
  label?: string;
  hint?: string;
  tooltip?: string;
  placeholder?: string;
  isRequired?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  options?: TagOption[];
  // When true, a typed value that isn't in the options can be committed as its own tag (e.g. an email
  // address). `validateCustom` gates which typed values are offered; the default accepts any non-empty
  // value. `customHint` is the invalid-typed-value message shown when nothing matches.
  allowCustom?: boolean;
  validateCustom?: (value: string) => boolean;
  customHint?: string;
}

export function InputTags({
  label,
  hint,
  tooltip,
  placeholder = "Select...",
  isRequired,
  value,
  defaultValue,
  onChange,
  options = [],
  allowCustom = false,
  validateCustom,
  customHint = "No results found",
}: InputTagsProps) {
  const [internalValue, setInternalValue] = useState<string[]>(
    defaultValue ?? [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = value ?? internalValue;

  function update(next: string[]) {
    setInternalValue(next);
    onChange?.(next);
  }

  function handleSelectionChange(keys: "all" | Set<Key>) {
    if (keys === "all") return;
    update([...keys].map(String));
  }

  function removeTag(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    update(selected.filter((v) => v !== id));
  }

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  // Render a chip for every selected value, resolving its label from the options and falling back to
  // the raw value for custom entries (e.g. a typed email that isn't in the list).
  const optionById = new Map(options.map((o) => [o.id, o]));
  const selectedItems: TagOption[] = selected.map(
    (id) => optionById.get(id) ?? { id, label: id },
  );

  // A typed value can be added as its own tag when custom entries are allowed, it isn't already
  // selected or a known option, and it passes the optional validator.
  const typed = search.trim();
  const matchesOption = options.some(
    (o) =>
      o.id.toLowerCase() === typed.toLowerCase() ||
      o.label.toLowerCase() === typed.toLowerCase(),
  );
  const canAddCustom =
    allowCustom &&
    typed.length > 0 &&
    !selected.includes(typed) &&
    !matchesOption &&
    (!validateCustom || validateCustom(typed));

  function addCustom() {
    if (!canAddCustom) return;
    update([...selected, typed]);
    setSearch("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label isRequired={isRequired} tooltip={tooltip}>
          {label}
        </Label>
      )}

      {/* Trigger */}
      {/* eslint-disable-next-line no-restricted-syntax */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cx(
          "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2.5 text-left shadow-xs ring-1 ring-primary transition-shadow duration-100 ring-inset",
          isOpen && "ring-2 ring-brand",
        )}
      >
        {selectedItems.length > 0 ? (
          <>
            {selectedItems.map((opt) => (
              <span
                key={opt.id}
                className="flex items-center gap-1.5 rounded-md border border-secondary bg-secondary px-2 py-0.5 text-xs font-medium text-secondary"
              >
                {opt.leading}
                {opt.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => removeTag(opt.id, e)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    removeTag(opt.id, e as unknown as React.MouseEvent)
                  }
                  className="ml-0.5 cursor-pointer text-quaternary hover:text-secondary"
                  aria-label={`Remove ${opt.label}`}
                >
                  <XClose className="size-3" />
                </span>
              </span>
            ))}
          </>
        ) : (
          <span className="text-md text-placeholder">{placeholder}</span>
        )}
        <ChevronDown
          className={cx(
            "ml-auto size-4 shrink-0 text-fg-quaternary transition-transform duration-150",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      <AriaPopover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearch("");
        }}
        placement="bottom start"
        offset={4}
        style={{ width: triggerRef.current?.offsetWidth ?? "100%" }}
        className="z-50 overflow-hidden rounded-lg border border-secondary bg-primary shadow-lg outline-hidden duration-150 animate-in fade-in slide-in-from-top-1"
      >
        {/* Search */}
        <div className="border-b border-secondary p-2">
          <div className="flex items-center gap-2 rounded-md border border-secondary bg-primary px-2.5 py-1.5">
            <SearchLg className="size-4 shrink-0 text-quaternary" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAddCustom) {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder={
                allowCustom ? "Search or type to add..." : "Search..."
              }
              className="flex-1 bg-transparent text-sm text-primary outline-hidden placeholder:text-placeholder"
            />
          </div>
        </div>

        {/* List */}
        <AriaListBox
          aria-label={label ?? "Options"}
          items={filtered}
          selectionMode="multiple"
          selectedKeys={new Set(selected)}
          onSelectionChange={handleSelectionChange}
          className="max-h-52 overflow-y-auto py-1 outline-hidden"
        >
          {(item) => (
            <AriaListBoxItem
              id={item.id}
              textValue={item.label}
              className={({ isFocused, isSelected }) =>
                cx(
                  "flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-sm outline-hidden select-none",
                  isFocused && "bg-tertiary",
                  isSelected && "bg-primary_hover",
                )
              }
            >
              {({ isSelected }) => (
                <>
                  {item.leading}
                  <span className="flex-1 text-sm text-primary">
                    {item.label}
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-brand-600" />
                  )}
                </>
              )}
            </AriaListBoxItem>
          )}
        </AriaListBox>

        {canAddCustom && (
          // Commit the typed value as its own tag. A div with a button role (not a <button>) keeps
          // focus in the search input and matches the remove-tag control's pattern.
          <div
            role="button"
            tabIndex={0}
            onMouseDown={(e) => e.preventDefault()}
            onClick={addCustom}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && addCustom()
            }
            className="flex cursor-pointer items-center gap-2.5 border-t border-secondary px-2.5 py-2 text-sm outline-hidden hover:bg-tertiary"
          >
            <Plus className="size-4 shrink-0 text-brand-600" />
            <span className="flex-1 text-primary">
              Add <span className="font-medium">{typed}</span>
            </span>
          </div>
        )}

        {filtered.length === 0 && !canAddCustom && (
          <p className="px-4 py-3 text-sm text-tertiary">
            {allowCustom && typed.length > 0 ? customHint : "No results found"}
          </p>
        )}
      </AriaPopover>

      {hint && <HintText>{hint}</HintText>}
    </div>
  );
}
