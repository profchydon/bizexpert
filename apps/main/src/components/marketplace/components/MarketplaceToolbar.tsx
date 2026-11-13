import type { ReactNode } from "react";
import { MarketplaceSearchField } from "./MarketplaceSearchField";
import { PrimaryButton } from "./PrimaryButton";

export interface MarketplaceToolbarProps {
  search: string | null;
  onSearchChange: (value: string) => void;
  onOpenCustomRequest: () => void;
  countrySelectorSlot: ReactNode;
  rfqButtonLabel?: string;
}

export const MarketplaceToolbar = ({
  search,
  onSearchChange,
  onOpenCustomRequest,
  countrySelectorSlot,
  rfqButtonLabel = "RFQ Request",
}: MarketplaceToolbarProps) => (
  <div className="mp-flex mp-flex-col mp-gap-3 md:mp-flex-row md:mp-items-center">
    <div className="mp-flex-1">
      <MarketplaceSearchField
        className="mp-h-[44px] mp-w-full"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>

    <div className="mp-flex mp-flex-col mp-gap-3 sm:mp-flex-row sm:mp-items-center">
      <div className="mp-w-full sm:mp-w-[220px]">{countrySelectorSlot}</div>

      <PrimaryButton
        size="lg"
        type="button"
        onClick={onOpenCustomRequest}
        className="mp-text-sm mp-font-semibold"
        data-testid="marketplace-custom-request-button"
      >
        {rfqButtonLabel}
      </PrimaryButton>
    </div>
  </div>
);
