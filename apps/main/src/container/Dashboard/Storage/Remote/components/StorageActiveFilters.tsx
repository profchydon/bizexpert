import { BadgeWithButton } from "@/components/base/badges/badges";
import type { InventoryFilters } from "../types/storage";
import { activeFilterChips } from "../utils/activeFilters";

interface Props {
  filters: InventoryFilters;
  onChange: (patch: Partial<InventoryFilters>) => void;
  onClearAll: () => void;
}

export function StorageActiveFilters({ filters, onChange, onClearAll }: Props) {
  const chips = activeFilterChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-secondary px-5 py-3">
      {chips.map((chip) => (
        <BadgeWithButton
          key={chip.key}
          size="sm"
          color="gray"
          buttonLabel={`Remove ${chip.label} filter`}
          onButtonClick={() => onChange(chip.clear)}
        >
          {chip.label}
        </BadgeWithButton>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-semibold text-tertiary transition hover:text-primary"
      >
        Clear all
      </button>
    </div>
  );
}
