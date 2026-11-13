import type { ChangeEventHandler } from "react";
import { Search } from "lucide-react";
import { cn } from "../utils/cn";

export interface MarketplaceSearchFieldProps {
  className?: string;
  value?: string | null;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  placeholder?: string;
}

export const MarketplaceSearchField = ({
  className,
  value,
  onChange,
  name,
  placeholder = "Search",
}: MarketplaceSearchFieldProps) => (
  <div
    className={cn(
      "mp-relative mp-flex mp-w-full mp-items-center mp-overflow-hidden mp-rounded-md mp-border mp-border-gray-200 mp-bg-white",
      className,
    )}
  >
    <Search className="mp-pointer-events-none mp-absolute mp-left-4 mp-z-10 mp-h-6 mp-w-6 mp-text-gray-600" />
    <input
      type="search"
      placeholder={placeholder}
      className="mp-h-full mp-w-full mp-border-0 mp-bg-transparent mp-py-3 mp-pl-12 mp-pr-4 mp-text-sm mp-text-gray-900 mp-outline-none focus:mp-ring-0"
      name={name}
      value={value ?? ""}
      onChange={onChange}
      data-testid="marketplace-search-input"
    />
  </div>
);
