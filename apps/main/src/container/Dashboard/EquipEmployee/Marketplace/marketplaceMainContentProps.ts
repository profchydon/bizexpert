import type { ReactNode } from "react";
import type { FilterActionsProps } from "./FilterActions";
import type { MarketplaceProductsSectionProps } from "./MarketplaceProductsSection";
import type { DeviceEntry } from "./CustomDeviceRequestModal/types";

export type MarketplaceMainContentProps = Omit<
  MarketplaceProductsSectionProps,
  "onClearFilters"
> & {
  isCatalogLoading: boolean;
  isCatalogError: boolean;
  filterProps: Omit<FilterActionsProps, "onApplyFilter" | "resetFilter">;
  isMobileFilterOpen: boolean;
  onOpenMobileFilter: () => void;
  onCloseMobileFilter: () => void;
  onApplyDesktopFilter: () => Promise<void>;
  onResetDesktopFilter: () => Promise<void>;
  onApplyMobileFilter: () => Promise<void>;
  onResetMobileFilter: () => Promise<void>;
  search: string | null;
  onSearchChange: (value: string) => void;
  countrySelectorSlot?: ReactNode;
  isCustomRequestOpen: boolean;
  onCustomRequestOpenChange: (value: boolean) => void;
  customRequestPrefill?: DeviceEntry[];
  customRequestReturnHref?: string;
  CustomDeviceRequestModal: React.ComponentType<{
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    prefillDevices?: DeviceEntry[];
    returnHref?: string;
  }>;
  toastState: { show: boolean; action: "added" | "removed" };
  onDismissToast: () => void;
  onViewFavorites: () => void;
};
