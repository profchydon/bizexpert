"use client";

import ReactCountryFlag from "react-country-flag";
import { OverviewInviteButton } from "./OverviewInviteButton";

export function OverviewScopedHeader({
  title,
  subtitle,
  countryCode,
}: Readonly<{
  title: string;
  subtitle: string;
  countryCode?: string;
}>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          {countryCode ? (
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              title={`${title} flag`}
              className="size-7 shrink-0 rounded-full object-cover ring-1 ring-border-secondary"
            />
          ) : null}
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        </div>
        <p className="mt-1 text-sm text-tertiary">{subtitle}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <OverviewInviteButton />
      </div>
    </div>
  );
}
