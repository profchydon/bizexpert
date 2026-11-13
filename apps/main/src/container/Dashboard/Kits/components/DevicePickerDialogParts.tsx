import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DevicePickerFilters({
  onSearchChange,
  search,
}: {
  onSearchChange: (value: string) => void;
  search: string;
}) {
  return (
    <div className="px-6 py-4">
      <Input
        placeholder="Search by name, brand, or model..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        startAdornment={<Search className="size-4 text-gray-400" />}
        data-testid="devicepickerdialogparts-input"
      />
    </div>
  );
}

export function DeviceCategoryTabs({
  categories,
  categoryId,
  onSelect,
}: {
  categories: { id: string | null; name: string }[];
  categoryId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto border-y border-gray-200 px-6 py-3">
      {categories.map((item) => (
        <button
          key={item.id ?? "all"}
          type="button"
          onClick={() => onSelect(item.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold",
            categoryId === item.id
              ? "bg-primary-50 text-primary-700"
              : "text-gray-600 hover:bg-gray-50",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export function DevicePickerFooter({
  onAdd,
  onCancel,
  selectedCount,
}: {
  onAdd: () => void;
  onCancel: () => void;
  selectedCount: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
      <span className="text-sm text-gray-600">
        {selectedCount} {selectedCount === 1 ? "device" : "devices"} selected
      </span>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          data-testid="devicepickerdialogparts-button"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={selectedCount === 0}
          onClick={onAdd}
          data-testid="devicepickerdialogparts-button-2"
        >
          Add Selected
        </Button>
      </div>
    </div>
  );
}
