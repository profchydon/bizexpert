import { FilterActionsProps } from "./FilterActions";

interface BuildMarketplaceFilterPropsArgs {
  currencySymbol?: string;
  minPriceValue: string;
  maxPriceValue: string;
  priceBounds?: {
    min: number;
    max: number;
  };
  setMinPriceValue: (value: string) => void;
  setMaxPriceValue: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedState: string[];
  setSelectedState: (value: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (value: string[]) => void;
  selectedMemory: string[];
  setSelectedMemory: (value: string[]) => void;
  selectedOs: string[];
  setSelectedOs: (value: string[]) => void;
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
  pulseKey: number;
}

const buildMarketplaceFilterProps = ({
  currencySymbol,
  minPriceValue,
  maxPriceValue,
  priceBounds,
  setMinPriceValue,
  setMaxPriceValue,
  selectedTypes,
  setSelectedTypes,
  selectedState,
  setSelectedState,
  selectedStorage,
  setSelectedStorage,
  selectedMemory,
  setSelectedMemory,
  selectedOs,
  setSelectedOs,
  isApplyFilterLoading,
  showFavoritesOnly,
  favoritesCount,
  onToggleFavoritesOnly,
  filterOptions,
  selectedExtraFilters,
  onChangeExtraFilter,
  pulseKey,
}: BuildMarketplaceFilterPropsArgs): Omit<
  FilterActionsProps,
  "onApplyFilter" | "resetFilter"
> => ({
  currencySymbol,
  priceRangeFilter: {
    minPriceValue,
    maxPriceValue,
    bounds: priceBounds,
    setMinPriceValue,
    setMaxPriceValue,
  },
  typeFilter: {
    selectedTypes,
    setSelectedTypes,
  },
  stateFilter: {
    selectedState,
    setSelectedState,
  },
  storageFilter: {
    selectedStorage,
    setSelectedStorage,
  },
  memoryFilter: {
    selectedMemory,
    setSelectedMemory,
  },
  osFilter: {
    selectedOs,
    setSelectedOs,
  },
  isApplyFilterLoading,
  showFavoritesOnly,
  favoritesCount,
  onToggleFavoritesOnly,
  filterOptions,
  selectedExtraFilters,
  onChangeExtraFilter,
  pulseKey,
});

export default buildMarketplaceFilterProps;
