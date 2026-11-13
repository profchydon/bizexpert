"use client";

import { Heart } from "lucide-react";
import { cn } from "../../utils/cn";
import type {
  MarketplaceFilterOptionsCatalog,
  MarketplaceMultiSelectFilter,
  MarketplacePriceRangeFilter,
} from "../../types";
import { ToggleSwitch } from "../ToggleSwitch";
import { CollapsibleSection } from "./CollapsibleSection";
import { CheckboxList } from "./CheckboxList";
import { PriceRangeInputs } from "./PriceRangeInputs";
import { FilterPanelExtraSections } from "./FilterPanelExtraSections";
import { FilterPanelFooter } from "./FilterPanelFooter";

export interface FilterPanelProps {
  currencySymbol?: string;
  priceRangeFilter: MarketplacePriceRangeFilter;
  typeFilter: MarketplaceMultiSelectFilter;
  stateFilter: MarketplaceMultiSelectFilter;
  storageFilter: MarketplaceMultiSelectFilter;
  memoryFilter: MarketplaceMultiSelectFilter;
  osFilter: MarketplaceMultiSelectFilter;
  onApplyFilter: () => void | Promise<void>;
  resetFilter: () => void | Promise<void>;
  isApplyFilterLoading?: boolean;
  showFavoritesOnly?: boolean;
  favoritesCount?: number;
  onToggleFavoritesOnly?: (value: boolean) => void;
  filterOptions?: MarketplaceFilterOptionsCatalog;
  selectedExtraFilters?: Record<string, string[]>;
  onChangeExtraFilter?: (key: string, value: string[]) => void;
  isMobile?: boolean;
  className?: string;
}

const toOptions = (values: string[] = []) =>
  values.map((value) => ({ value, label: value }));

export const FilterPanel = ({
  currencySymbol,
  priceRangeFilter,
  typeFilter,
  stateFilter,
  storageFilter,
  memoryFilter,
  osFilter,
  onApplyFilter,
  resetFilter,
  isApplyFilterLoading,
  showFavoritesOnly = false,
  favoritesCount = 0,
  onToggleFavoritesOnly,
  filterOptions,
  selectedExtraFilters = {},
  onChangeExtraFilter,
  isMobile,
  className,
}: FilterPanelProps) => {
  return (
    <aside
      className={cn(
        "mp-root mp-flex mp-w-full mp-min-h-0 mp-flex-col",
        isMobile
          ? "mp-h-full"
          : "mp-hidden mp-w-[280px] mp-shrink-0 lg:mp-sticky lg:mp-top-24 lg:mp-flex lg:mp-h-[calc(100vh-6.5rem)] xl:mp-w-[298px]",
        className,
      )}
    >
      <div className="mp-min-h-0 mp-flex-1 mp-overflow-y-auto mp-pr-1">
        <div className="mp-flex mp-flex-col mp-gap-4 mp-pb-2">
          <div className="mp-flex mp-flex-col mp-gap-1">
            <h3 className="mp-text-lg mp-leading-7 mp-font-semibold mp-text-gray-900">
              Filter
            </h3>
            <p className="mp-text-sm mp-text-gray-500">
              Find the right hardware for your team
            </p>
          </div>
          <div className="mp-h-px mp-w-full mp-bg-gray-200" />
        </div>

        {onToggleFavoritesOnly && (
          <>
            <div className="mp-flex mp-items-center mp-justify-between mp-rounded-lg mp-px-3.5 mp-py-2.5 mp-transition-colors hover:mp-bg-gray-50">
              <div className="mp-flex mp-items-center mp-gap-x-2">
                <Heart className="mp-h-5 mp-w-5 mp-fill-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary,#085DE8)]" />
                <span className="mp-text-sm mp-font-medium mp-text-gray-900">
                  Favorites ({favoritesCount})
                </span>
              </div>
              <ToggleSwitch
                checked={showFavoritesOnly}
                onCheckedChange={onToggleFavoritesOnly}
                aria-label="Show favorites only"
              />
            </div>
            <div className="mp-my-2 mp-h-px mp-w-full mp-bg-gray-200" />
          </>
        )}

        <div className="mp-flex mp-flex-col mp-gap-4 mp-py-2">
          <div className="mp-px-3.5 mp-py-2.5">
            <span className="mp-text-lg mp-font-semibold mp-text-gray-900">
              Price
            </span>
          </div>
          <PriceRangeInputs
            currencySymbol={currencySymbol}
            {...priceRangeFilter}
          />
        </div>
        <div className="mp-my-2 mp-h-px mp-w-full mp-bg-gray-200" />

        {(filterOptions?.type?.length ?? 0) > 0 && (
          <CollapsibleSection title="Type">
            <CheckboxList
              name="type"
              options={(filterOptions?.type ?? []).map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              selected={typeFilter.selected}
              onChange={typeFilter.setSelected}
            />
          </CollapsibleSection>
        )}

        {(filterOptions?.state?.length ?? 0) > 0 && (
          <CollapsibleSection title="Asset State" defaultOpen={false}>
            <CheckboxList
              name="state"
              options={toOptions(filterOptions?.state)}
              selected={stateFilter.selected}
              onChange={stateFilter.setSelected}
            />
          </CollapsibleSection>
        )}

        {(filterOptions?.hardDrive?.length ?? 0) > 0 && (
          <CollapsibleSection title="Hard Drive" defaultOpen={false}>
            <CheckboxList
              name="hard-drive"
              options={toOptions(filterOptions?.hardDrive)}
              selected={storageFilter.selected}
              onChange={storageFilter.setSelected}
            />
          </CollapsibleSection>
        )}

        {(filterOptions?.ram?.length ?? 0) > 0 && (
          <CollapsibleSection title="RAM" defaultOpen={false}>
            <CheckboxList
              name="ram"
              options={toOptions(filterOptions?.ram)}
              selected={memoryFilter.selected}
              onChange={memoryFilter.setSelected}
            />
          </CollapsibleSection>
        )}

        {(filterOptions?.os?.length ?? 0) > 0 && (
          <CollapsibleSection title="OS" defaultOpen={false}>
            <CheckboxList
              name="os"
              options={toOptions(filterOptions?.os)}
              selected={osFilter.selected}
              onChange={osFilter.setSelected}
            />
          </CollapsibleSection>
        )}

        <FilterPanelExtraSections
          filterOptions={filterOptions}
          selectedExtraFilters={selectedExtraFilters}
          onChangeExtraFilter={onChangeExtraFilter}
        />
      </div>

      <FilterPanelFooter
        isMobile={isMobile}
        isApplyFilterLoading={isApplyFilterLoading}
        onApplyFilter={onApplyFilter}
        resetFilter={resetFilter}
      />
    </aside>
  );
};
