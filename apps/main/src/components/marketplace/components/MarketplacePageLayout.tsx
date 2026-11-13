import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { MarketplaceToolbar } from "./MarketplaceToolbar";
import {
  MarketplaceMobileFilterDrawer,
  MarketplaceMobileFilterTrigger,
} from "./MarketplaceMobileFilterDrawer";

export interface MarketplacePageLayoutProps {
  filterPanel: ReactNode;
  mobileFilterPanel: ReactNode;
  isMobileFilterOpen: boolean;
  onOpenMobileFilter: () => void;
  onCloseMobileFilter: () => void;
  search: string | null;
  onSearchChange: (value: string) => void;
  onOpenCustomRequest: () => void;
  countrySelectorSlot: ReactNode;
  children: ReactNode;
  className?: string;
  rfqButtonLabel?: string;
}

export const MarketplacePageLayout = ({
  filterPanel,
  mobileFilterPanel,
  isMobileFilterOpen,
  onOpenMobileFilter,
  onCloseMobileFilter,
  search,
  onSearchChange,
  onOpenCustomRequest,
  countrySelectorSlot,
  children,
  className,
  rfqButtonLabel,
}: MarketplacePageLayoutProps) => (
  <div className={cn("mp-root mp-w-full", className)}>
    <MarketplaceMobileFilterTrigger onOpen={onOpenMobileFilter} />

    <div className="mp-flex mp-items-start mp-gap-8">
      <div className="mp-hidden lg:mp-block">{filterPanel}</div>

      <div className="mp-hidden mp-w-px mp-self-stretch mp-bg-gray-200 lg:mp-block" />

      <main className="mp-flex mp-min-w-0 mp-flex-1 mp-flex-col mp-gap-6">
        <div className="mp-flex mp-flex-col mp-gap-5">
          <MarketplaceToolbar
            search={search}
            onSearchChange={onSearchChange}
            onOpenCustomRequest={onOpenCustomRequest}
            countrySelectorSlot={countrySelectorSlot}
            rfqButtonLabel={rfqButtonLabel}
          />
          <div className="mp-h-px mp-w-full mp-bg-gray-200" />
        </div>

        {children}
      </main>
    </div>

    <MarketplaceMobileFilterDrawer
      isOpen={isMobileFilterOpen}
      onClose={onCloseMobileFilter}
    >
      {mobileFilterPanel}
    </MarketplaceMobileFilterDrawer>
  </div>
);
