"use client";

import { useState } from "react";
import { Check, Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import {
  SUPPORTED_COUNTRIES,
  type SupportedCountry,
} from "../data/supportedCountries";
import { RegisterInterestModal } from "./RegisterInterestModal";

interface Props {
  selected: SupportedCountry | null;
  onSelect: (country: SupportedCountry) => void;
  onRegisterInterest: (countries: string[]) => void;
}

export function CountryStep({ selected, onSelect, onRegisterInterest }: Props) {
  const [interestOpen, setInterestOpen] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Where are your devices?
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Open Fleet is available in countries where Rayda offers storage.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUPPORTED_COUNTRIES.map((c) => {
          const active = selected?.country === c.country;
          const Flag = c.flag;
          return (
            <button
              key={c.country}
              type="button"
              onClick={() => onSelect(c)}
              className={cx(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition hover:shadow-sm",
                active
                  ? "border-brand bg-brand-50 ring-1 ring-brand"
                  : "border-secondary hover:border-brand",
              )}
            >
              <Flag className="size-7 shrink-0 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">
                  {c.country}
                </p>
                <p className="text-xs text-tertiary">{c.intakeEstimate}</p>
              </div>
              <span
                className={cx(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                  active
                    ? "border-brand bg-brand-solid text-white"
                    : "border-secondary",
                )}
              >
                {active && <Check className="size-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-secondary bg-secondary p-4">
        <p className="text-sm text-tertiary">
          Don&apos;t see your country? Open Fleet isn&apos;t available in your
          region yet.
        </p>
        <Button
          size="sm"
          color="secondary"
          iconLeading={Plus}
          onClick={() => setInterestOpen(true)}
          data-testid="countrystep-button"
        >
          Register interest
        </Button>
      </div>
      <RegisterInterestModal
        isOpen={interestOpen}
        onClose={() => setInterestOpen(false)}
        onSubmit={(countries) => {
          onRegisterInterest(countries);
          setInterestOpen(false);
        }}
      />
    </div>
  );
}
