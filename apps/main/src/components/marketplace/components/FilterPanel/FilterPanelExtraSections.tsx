import type { MarketplaceFilterOptionsCatalog } from "../../types";
import { CollapsibleSection } from "./CollapsibleSection";
import { CheckboxList } from "./CheckboxList";

const toOptions = (values: string[] = []) =>
  values.map((value) => ({ value, label: value }));

export function FilterPanelExtraSections({
  filterOptions,
  selectedExtraFilters,
  onChangeExtraFilter,
}: {
  filterOptions?: MarketplaceFilterOptionsCatalog;
  selectedExtraFilters: Record<string, string[]>;
  onChangeExtraFilter?: (key: string, value: string[]) => void;
}) {
  const extraFilters = [
    { key: "processor", title: "Processor", options: filterOptions?.processor },
    { key: "display", title: "Display", options: filterOptions?.display },
    { key: "keyboard", title: "Keyboard", options: filterOptions?.keyboard },
    {
      key: "power_adapter",
      title: "Power Adapter",
      options: filterOptions?.powerAdapter,
    },
    { key: "warranty", title: "Warranty", options: filterOptions?.warranty },
    { key: "spec_tier", title: "Spec Tier", options: filterOptions?.specTier },
    { key: "colour", title: "Colour", options: filterOptions?.colour },
  ].filter((item) => (item.options?.length ?? 0) > 0);

  return (
    <>
      {extraFilters.map((filter) => (
        <CollapsibleSection
          key={filter.key}
          title={filter.title}
          defaultOpen={false}
        >
          <CheckboxList
            name={filter.key}
            options={toOptions(filter.options)}
            selected={selectedExtraFilters[filter.key] ?? []}
            onChange={(value) => onChangeExtraFilter?.(filter.key, value)}
          />
        </CollapsibleSection>
      ))}
    </>
  );
}
