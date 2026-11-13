import { DualRangeSlider } from "@/components/ui/slider";
import type { RequestFilters } from "../types";

interface BudgetRangeSectionProps {
  budgetRange: RequestFilters["budgetRange"];
  min: number;
  max: number;
  onChange: (value: RequestFilters["budgetRange"]) => void;
}

export default function BudgetRangeSection({
  budgetRange,
  min,
  max,
  onChange,
}: Readonly<BudgetRangeSectionProps>) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-semibold text-gray-700">Budget Range</span>
      <DualRangeSlider
        value={budgetRange}
        onValueChange={(value) => onChange(value as [number, number])}
        min={min}
        max={max}
        step={1000}
      />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{budgetRange[0].toLocaleString()}</span>
        <span>{budgetRange[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
