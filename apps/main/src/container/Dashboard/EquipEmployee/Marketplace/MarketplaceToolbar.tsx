import type { ReactNode } from "react";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import MarketplaceCountrySelector from "./MarketplaceCountrySelector";

interface MarketplaceToolbarProps {
  search: string | null;
  onSearchChange: (value: string) => void;
  onOpenCustomRequest: () => void;
  countrySelectorSlot?: ReactNode;
}

const MarketplaceToolbar: React.FC<MarketplaceToolbarProps> = ({
  search,
  onSearchChange,
  onOpenCustomRequest,
  countrySelectorSlot,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <SearchWithIcon
          className="h-12 w-full"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[220px]">
          {countrySelectorSlot ?? <MarketplaceCountrySelector />}
        </div>

        <Button
          size="lg"
          type="button"
          onClick={onOpenCustomRequest}
          className="text-sm font-semibold"
          data-testid="marketplacetoolbar-button"
        >
          RFQ Request
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceToolbar;
