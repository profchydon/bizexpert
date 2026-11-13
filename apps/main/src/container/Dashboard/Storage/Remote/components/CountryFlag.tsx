import { cn } from "@/lib/utils";
import { resolveCountryFlag } from "../utils/resolveCountryFlag";

export function CountryFlag({
  country,
  countryCode,
  className = "size-4 rounded-full",
}: Readonly<{
  country: string;
  countryCode?: string;
  className?: string;
}>) {
  const { Flag, initials } = resolveCountryFlag(countryCode, country);

  if (Flag) {
    return <Flag className={className} />;
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-secondary text-[8px] font-semibold uppercase text-secondary",
        className,
      )}
    >
      {initials}
    </span>
  );
}
