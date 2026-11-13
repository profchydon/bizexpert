"use client";

import { useMemo, useState } from "react";
import { SearchLg, XClose } from "@untitledui/icons";
import {
  Button as AriaButton,
  Input as AriaInput,
} from "react-aria-components";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { CheckboxBase } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { INTEREST_COUNTRIES } from "../data/interestCountries";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (countries: string[]) => void;
}

export function RegisterInterestModal({ isOpen, onClose, onSubmit }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? INTEREST_COUNTRIES.filter((c) => c.label.toLowerCase().includes(q))
      : INTEREST_COUNTRIES;
  }, [query]);

  const toggle = (code: string) =>
    setSelected((s) =>
      s.includes(code) ? s.filter((x) => x !== code) : [...s, code],
    );
  const reset = () => {
    setSelected([]);
    setQuery("");
  };
  const close = () => {
    reset();
    onClose();
  };
  const submit = () => {
    onSubmit(
      selected.map(
        (code) =>
          INTEREST_COUNTRIES.find((c) => c.code === code)?.label ?? code,
      ),
    );
    reset();
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(o) => !o && close()}
      isDismissable
    >
      <Modal className="max-w-lg">
        <Dialog data-testid="registerinterestmodal-dialog">
          <div className="flex max-h-[80dvh] w-full flex-col overflow-hidden rounded-xl bg-primary shadow-xl">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-secondary px-5 py-4">
              <div className="pr-2">
                <h2 className="text-md font-semibold text-primary">
                  Register interest
                </h2>
                <p className="mt-0.5 text-sm text-tertiary">
                  Select the countries where you have devices. We&apos;ll let
                  you know when Open Fleet launches there.
                </p>
              </div>
              <ButtonUtility
                size="sm"
                color="tertiary"
                icon={XClose}
                aria-label="Close"
                onClick={close}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 border-b border-secondary px-5 py-2.5">
              <SearchLg className="size-4 shrink-0 text-fg-quaternary" />
              <AriaInput
                aria-label="Search countries"
                placeholder="Search countries"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-primary outline-hidden placeholder:text-placeholder"
              />
            </div>

            {selected.length > 0 && (
              <div className="flex max-h-24 shrink-0 flex-wrap items-center gap-1.5 overflow-y-auto border-b border-secondary px-5 py-2.5">
                {selected.map((code) => {
                  const c = INTEREST_COUNTRIES.find((x) => x.code === code);
                  return (
                    <span
                      key={code}
                      className="flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-2 text-xs font-medium text-brand-700"
                    >
                      {c?.label}
                      <AriaButton
                        onPress={() => toggle(code)}
                        aria-label={`Remove ${c?.label}`}
                        className="rounded-full p-0.5 text-brand-700 outline-hidden transition hover:text-brand-800"
                      >
                        <XClose className="size-3" />
                      </AriaButton>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <p className="px-5 py-3 text-sm text-tertiary">
                  No countries match &ldquo;{query}&rdquo;.
                </p>
              )}
              {filtered.map((c) => {
                const Flag = c.flag;
                const isSel = selected.includes(c.code);
                return (
                  <AriaButton
                    key={c.code}
                    onPress={() => toggle(c.code)}
                    className={cx(
                      "flex w-full items-center gap-3 px-5 py-2 text-left outline-hidden transition hover:bg-secondary",
                      isSel && "bg-secondary",
                    )}
                  >
                    <CheckboxBase size="sm" isSelected={isSel} />
                    {Flag && <Flag className="size-5 shrink-0 rounded-full" />}
                    <span className="text-sm font-medium text-primary">
                      {c.label}
                    </span>
                  </AriaButton>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-secondary px-5 py-3">
              <Button
                color="secondary"
                size="md"
                onClick={close}
                data-testid="registerinterestmodal-button"
              >
                Cancel
              </Button>
              <Button
                size="md"
                isDisabled={selected.length === 0}
                onClick={submit}
                data-testid="registerinterestmodal-button-2"
              >
                {selected.length > 0
                  ? `Register interest (${selected.length})`
                  : "Register interest"}
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
