"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SETTINGS_GROUPS,
  SETTINGS_TABS,
  type SettingsType,
} from "./settingsNav";

interface Props {
  type: SettingsType;
  onChange: (next: SettingsType) => void;
}

const LABEL = new Map(SETTINGS_TABS.map((tab) => [tab.id, tab.label]));

export function SettingsSectionNav({ type, onChange }: Props) {
  return (
    <>
      <div className="lg:hidden">
        <Select
          value={type}
          onValueChange={(next) => onChange(next as SettingsType)}
          data-testid="settingssectionnav-select"
        >
          <SelectTrigger
            className="w-full"
            aria-label="Settings section"
            data-testid="settings-select"
          >
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {SETTINGS_TABS.map((tab) => (
              <SelectItem key={tab.id} value={tab.id}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav
        aria-label="Settings sections"
        className="hidden w-60 shrink-0 flex-col gap-6 rounded-xl border border-gray-200 bg-white p-3 lg:sticky lg:top-[104px] lg:flex"
      >
        {SETTINGS_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              {group.label}
            </p>
            {group.tabs.map((id) => {
              const selected = id === type;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => onChange(id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
                    selected
                      ? "bg-primary-50 font-semibold text-primary-700"
                      : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {LABEL.get(id)}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
