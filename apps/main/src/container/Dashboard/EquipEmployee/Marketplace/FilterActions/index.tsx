import React from "react";
import { FilterPanel } from "@raydahq/marketplace-ui";
import { TypeActionsProp } from "./TypeActions";
import { PriceRangeActionProps } from "./PriceRangeAction";
import { StateActionsProp } from "./StateActions";
import { StorageActionsProp } from "./StorageActions";
import { MemoryActionsProp } from "./MemoryActions";
import { OsActionsProp } from "./OsActions";

export interface FilterActionsProps {
  currencySymbol?: string;
  priceRangeFilter: PriceRangeActionProps;
  typeFilter: TypeActionsProp;
  stateFilter: StateActionsProp;
  storageFilter: StorageActionsProp;
  memoryFilter: MemoryActionsProp;
  osFilter: OsActionsProp;
  onApplyFilter: () => Promise<void> | void;
  resetFilter: () => Promise<void> | void;
  isApplyFilterLoading: boolean;
  showFavoritesOnly: boolean;
  favoritesCount: number;
  onToggleFavoritesOnly: (value: boolean) => void;
  filterOptions?: {
    type?: Array<{ id: string; name: string }>;
    state?: string[];
    hardDrive?: string[];
    ram?: string[];
    os?: string[];
    processor?: string[];
    display?: string[];
    keyboard?: string[];
    powerAdapter?: string[];
    warranty?: string[];
    specTier?: string[];
    colour?: string[];
  };
  selectedExtraFilters: Record<string, string[]>;
  onChangeExtraFilter: (key: string, value: string[]) => void;
  isMobile?: boolean;
  pulseKey?: number;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  currencySymbol,
  priceRangeFilter,
  typeFilter,
  stateFilter,
  storageFilter,
  memoryFilter,
  osFilter,
  onApplyFilter,
  isApplyFilterLoading,
  resetFilter,
  showFavoritesOnly,
  favoritesCount,
  onToggleFavoritesOnly,
  filterOptions,
  selectedExtraFilters,
  onChangeExtraFilter,
  isMobile,
}) => (
  <FilterPanel
    currencySymbol={currencySymbol}
    priceRangeFilter={{
      minPriceValue:
        Number(priceRangeFilter.minPriceValue) ||
        priceRangeFilter.bounds?.min ||
        0,
      maxPriceValue:
        Number(priceRangeFilter.maxPriceValue) ||
        priceRangeFilter.bounds?.max ||
        0,
      setMinPriceValue: (value: string | number) =>
        priceRangeFilter.setMinPriceValue(String(value)),
      setMaxPriceValue: (value: string | number) =>
        priceRangeFilter.setMaxPriceValue(String(value)),
      bounds: priceRangeFilter.bounds
        ? [priceRangeFilter.bounds.min, priceRangeFilter.bounds.max]
        : null,
    }}
    typeFilter={{
      selected: typeFilter.selectedTypes,
      setSelected: typeFilter.setSelectedTypes,
    }}
    stateFilter={{
      selected: stateFilter.selectedState,
      setSelected: stateFilter.setSelectedState,
    }}
    storageFilter={{
      selected: storageFilter.selectedStorage,
      setSelected: storageFilter.setSelectedStorage,
    }}
    memoryFilter={{
      selected: memoryFilter.selectedMemory,
      setSelected: memoryFilter.setSelectedMemory,
    }}
    osFilter={{
      selected: osFilter.selectedOs,
      setSelected: osFilter.setSelectedOs,
    }}
    onApplyFilter={onApplyFilter}
    resetFilter={resetFilter}
    isApplyFilterLoading={isApplyFilterLoading}
    showFavoritesOnly={showFavoritesOnly}
    favoritesCount={favoritesCount}
    onToggleFavoritesOnly={onToggleFavoritesOnly}
    filterOptions={filterOptions}
    selectedExtraFilters={selectedExtraFilters}
    onChangeExtraFilter={onChangeExtraFilter}
    isMobile={isMobile}
  />
);

export default FilterActions;
