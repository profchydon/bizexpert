"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSelectedValue } from "../utils/toggleSelectedValue";
import { AccountsFilterChip } from "./AccountsFilterChip";
import {
  accountsFilterPanelFooterClass,
  accountsFilterPanelResetClass,
} from "./accountsFilterPanelClasses";

export type AccountsFilterGroup = {
  key: string;
  label: string;
  options: { id: string; label: string }[];
};

type Values = Record<string, string[]>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groups: AccountsFilterGroup[];
  values: Values;
  onApply: (next: Values) => void;
}

export function AccountsFilterPanel({
  isOpen,
  onClose,
  groups,
  values,
  onApply,
}: Props) {
  const [draft, setDraft] = useState<Values>(values);

  useEffect(() => {
    if (isOpen) setDraft(values);
  }, [isOpen, values]);

  if (!isOpen) return null;

  const cleared = Object.fromEntries(groups.map((group) => [group.key, []]));

  const handleReset = () => {
    setDraft(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 bottom-4 z-50 max-h-[80vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-2 md:w-[340px]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto p-5">
          {groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold text-gray-700">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <AccountsFilterChip
                    key={option.id}
                    label={option.label}
                    isSelected={(draft[group.key] ?? []).includes(option.id)}
                    onClick={() =>
                      setDraft((previous) => ({
                        ...previous,
                        [group.key]: toggleSelectedValue(
                          previous[group.key] ?? [],
                          option.id,
                        ),
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3">
          <div className={accountsFilterPanelFooterClass}>
            <button
              type="button"
              onClick={handleReset}
              className={accountsFilterPanelResetClass}
            >
              Reset
            </button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="gap-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => {
                onApply(draft);
                onClose();
              }}
              data-testid="accountsfilterpanel-button"
            >
              <Filter className="size-4" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
