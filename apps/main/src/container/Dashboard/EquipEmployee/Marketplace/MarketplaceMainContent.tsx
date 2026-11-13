import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import PageState from "@/components/PageState";
import FavoritesToast from "./FavoritesToast";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import MarketplaceToolbar from "./MarketplaceToolbar";
import MarketplaceContextRow from "./MarketplaceContextRow";
import MarketplaceProductsSection from "./MarketplaceProductsSection";
import type { MarketplaceMainContentProps } from "./marketplaceMainContentProps";

const MarketplaceMainContent: React.FC<MarketplaceMainContentProps> = ({
  isCatalogLoading,
  isCatalogError,
  filterProps,
  isMobileFilterOpen,
  onOpenMobileFilter,
  onCloseMobileFilter,
  onApplyDesktopFilter,
  onResetDesktopFilter,
  onApplyMobileFilter,
  onResetMobileFilter,
  search,
  onSearchChange,
  onOpenCustomRequest,
  countrySelectorSlot,
  isCustomRequestOpen,
  onCustomRequestOpenChange,
  customRequestPrefill,
  customRequestReturnHref,
  CustomDeviceRequestModal,
  toastState,
  onDismissToast,
  onViewFavorites,
  ...productsSectionProps
}) => {
  return (
    <div className="w-full page-px">
      <div className="mb-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenMobileFilter}
          data-testid="marketplacemaincontent-button"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex items-start gap-8">
        <FilterSidebar
          {...filterProps}
          onApplyFilter={onApplyDesktopFilter}
          resetFilter={onResetDesktopFilter}
        />

        <div className="hidden w-px self-stretch bg-border-secondary lg:block" />

        <main className="min-w-0 flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <MarketplaceToolbar
              search={search}
              onSearchChange={onSearchChange}
              onOpenCustomRequest={onOpenCustomRequest}
              countrySelectorSlot={countrySelectorSlot}
            />

            <div className="h-px w-full bg-border-secondary" />
          </div>

          <MarketplaceContextRow
            countryCode={
              productsSectionProps.countryCode ??
              productsSectionProps.selectedCountry?.code
            }
            countryLabel={
              productsSectionProps.countryName ??
              productsSectionProps.selectedCountry?.name
            }
          />

          <PageState isLoading={isCatalogLoading} isError={isCatalogError}>
            <MarketplaceProductsSection
              {...productsSectionProps}
              onOpenCustomRequest={onOpenCustomRequest}
              onClearFilters={onResetDesktopFilter}
            />
          </PageState>

          <CustomDeviceRequestModal
            isOpen={isCustomRequestOpen}
            onOpenChange={onCustomRequestOpenChange}
            prefillDevices={customRequestPrefill}
            returnHref={customRequestReturnHref}
          />

          <FavoritesToast
            show={toastState.show}
            action={toastState.action}
            onDismiss={onDismissToast}
            onViewFavorites={onViewFavorites}
          />

          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={onCloseMobileFilter}
            {...filterProps}
            onApplyFilter={onApplyMobileFilter}
            resetFilter={onResetMobileFilter}
          />
        </main>
      </div>
    </div>
  );
};

export default MarketplaceMainContent;
