"use client";

import type { FC } from "react";
import * as CountryFlags from "@untitledui/country-flags";
import { Globe01 } from "@untitledui/icons";
import { Select } from "@/components/base/select/select";
import { buildCountryMetricLinks } from "./buildCountryMetricLinks";
import { CountryMetricRow } from "./CountryMetricRow";
import { SidebarGlobe } from "./SidebarGlobe";
import type { CountryEntry } from "./types";

export const ALL_COUNTRIES = "ALL";

type CountrySidebarProps = {
  data: CountryEntry[];
  selectedCode: string;
  onSelect: (code: string) => void;
};

function getFlagIcon(code: string): FC | undefined {
  const key =
    `Flag${code[0].toUpperCase()}${code[1].toLowerCase()}` as keyof typeof CountryFlags;
  return CountryFlags[key] as FC | undefined;
}

export function CountrySidebar({
  data,
  selectedCode,
  onSelect,
}: CountrySidebarProps) {
  const isAll = selectedCode === ALL_COUNTRIES;
  const country = data.find((entry) => entry.code === selectedCode);
  const items = [
    { id: ALL_COUNTRIES, label: "All countries", icon: Globe01 as FC },
    ...data.map((entry) => ({
      id: entry.code,
      label: entry.name,
      icon: getFlagIcon(entry.code),
    })),
  ];
  const metricLinks = country ? buildCountryMetricLinks(country) : [];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-secondary bg-primary shadow-md">
      <div className="shrink-0 border-b border-border-secondary px-4 pt-6 pb-4">
        <p className="text-base font-semibold text-primary">Select country</p>
        <p className="mt-0.5 text-sm text-tertiary">
          Choose a country to view detailed information.
        </p>
      </div>
      <div className="shrink-0 px-4 pt-4">
        <Select.ComboBox
          items={items}
          placeholder="Select country"
          size="md"
          shortcut={false}
          icon={isAll ? undefined : getFlagIcon(selectedCode)}
          selectedKey={isAll ? null : selectedCode}
          onSelectionChange={(key) =>
            onSelect(key == null ? ALL_COUNTRIES : String(key))
          }
        >
          {(item) => <Select.Item key={item.id} {...item} />}
        </Select.ComboBox>
        <div className="mt-4 h-px bg-border-secondary" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {isAll || !country ? (
          <SidebarGlobe />
        ) : (
          <div className="flex flex-col gap-3">
            {metricLinks.map((row) => (
              <CountryMetricRow
                key={row.label}
                icon={row.icon}
                label={row.label}
                href={row.href}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
