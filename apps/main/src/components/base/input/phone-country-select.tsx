"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import {
  Button as AriaButton,
  DialogTrigger,
  Popover,
} from "react-aria-components";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";
import { phoneCountries, phoneDialCodes } from "@/utils/phone/phone-data";
import {
  nextPhoneAfterExampleEdit,
  phoneExampleValue,
} from "./phoneExampleEdit";

type Props = {
  country: string;
  phone: string;
  onCountryChange: (country: string) => void;
  onPhoneChange: (phone: string) => void;
  isInvalid?: boolean;
  hint?: string;
};

export function PhoneCountrySelect({
  country,
  phone,
  onCountryChange,
  onPhoneChange,
  isInvalid,
  hint,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [exampleDismissed, setExampleDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialCode = phoneDialCodes[country] ?? "";
  const example = phoneExampleValue(dialCode);
  const showingExample = phone === "" && !exampleDismissed;

  const selectExample = () => {
    const input = inputRef.current;
    if (!input || phone !== "" || exampleDismissed) return;
    input.select();
  };

  const filtered = search
    ? phoneCountries.filter(({ label, dialCode }) => {
        const query = search.toLowerCase();
        return label.toLowerCase().includes(query) || dialCode.includes(query);
      })
    : phoneCountries;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Phone number</Label>
      <div
        className={cx(
          "flex items-center overflow-hidden rounded-lg border bg-primary shadow-xs transition-shadow duration-100 ease-linear focus-within:ring-2",
          isInvalid
            ? "border-error_subtle focus-within:ring-error"
            : "border-primary focus-within:ring-brand",
        )}
      >
        <DialogTrigger
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setSearch("");
          }}
        >
          <AriaButton className="flex h-full shrink-0 items-center gap-1.5 border-r border-primary px-3 py-2.5 outline-hidden">
            <span className="text-sm font-medium text-secondary">
              {country.toUpperCase()}
            </span>
            <ChevronDown className="size-4 text-fg-quaternary" />
          </AriaButton>
          <Popover
            placement="bottom start"
            className="z-[1010] w-64 overflow-hidden rounded-lg border border-secondary bg-primary shadow-lg outline-hidden"
          >
            <div className="border-b border-secondary px-3 py-2">
              <input
                type="text"
                className="w-full bg-transparent text-sm text-primary outline-hidden placeholder:text-tertiary"
                placeholder="Search country..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.map(({ dialCode, icon: Flag, id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={cx(
                    "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition hover:bg-secondary",
                    country === id && "bg-secondary",
                  )}
                  onClick={() => {
                    onCountryChange(id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <Flag className="size-5 shrink-0 overflow-hidden rounded-full" />
                  <span className="text-sm font-medium text-primary">
                    {label}
                  </span>
                  <span className="ml-auto text-sm text-tertiary">
                    {dialCode}
                  </span>
                </button>
              ))}
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-tertiary">
                  No countries found
                </p>
              ) : null}
            </div>
          </Popover>
        </DialogTrigger>
        {showingExample ? null : (
          <span className="pointer-events-none pl-3 text-md text-secondary">
            {dialCode}
          </span>
        )}
        <input
          ref={inputRef}
          type="tel"
          className={cx(
            "w-full bg-transparent py-2.5 pr-3.5 text-md outline-hidden",
            showingExample ? "pl-3 text-placeholder" : "pl-1.5 text-primary",
          )}
          value={showingExample ? example : phone}
          onFocus={() => {
            requestAnimationFrame(selectExample);
          }}
          onChange={(event) => {
            if (!showingExample) {
              onPhoneChange(event.target.value.replace(/\D/g, ""));
              return;
            }
            const next = nextPhoneAfterExampleEdit(event.target.value, example);
            if (!next.dismissed) return;
            setExampleDismissed(true);
            onPhoneChange(next.phone);
          }}
        />
      </div>
      {hint ? <HintText isInvalid={isInvalid}>{hint}</HintText> : null}
    </div>
  );
}
