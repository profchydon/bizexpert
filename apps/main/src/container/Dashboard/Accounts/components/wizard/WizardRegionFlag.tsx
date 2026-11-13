import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  className?: string;
}

export function WizardRegionFlag({ code, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 overflow-hidden rounded-full",
        className,
      )}
    >
      <ReactCountryFlag
        countryCode={code}
        svg
        aria-hidden
        style={{ width: "20px", height: "20px", objectFit: "cover" }}
      />
    </span>
  );
}
