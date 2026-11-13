import type { FC } from "react";
import * as CountryFlags from "@untitledui/country-flags";

export function flagByCode(
  code?: string,
): FC<{ className?: string }> | undefined {
  if (!code || code.length < 2) return undefined;
  const key =
    `Flag${code[0]!.toUpperCase()}${code[1]!.toLowerCase()}` as keyof typeof CountryFlags;
  return CountryFlags[key] as FC<{ className?: string }> | undefined;
}
