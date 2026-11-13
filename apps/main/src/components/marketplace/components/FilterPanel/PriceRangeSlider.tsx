import { cn } from "../../utils/cn";

export interface PriceRangeSliderProps {
  minValue: number;
  maxValue: number;
  boundsMin: number;
  boundsMax: number;
  onChange: (minValue: number, maxValue: number) => void;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const PriceRangeSlider = ({
  minValue,
  maxValue,
  boundsMin,
  boundsMax,
  onChange,
  className,
}: PriceRangeSliderProps) => {
  const range = Math.max(boundsMax - boundsMin, 1);
  const safeMin = clamp(minValue, boundsMin, boundsMax);
  const safeMax = clamp(maxValue, boundsMin, boundsMax);
  const [leftValue, rightValue] =
    safeMin <= safeMax ? [safeMin, safeMax] : [safeMax, safeMin];

  const leftPercent = ((leftValue - boundsMin) / range) * 100;
  const widthPercent = ((rightValue - leftValue) / range) * 100;

  const handleMinChange = (nextMin: number) => {
    const clamped = clamp(nextMin, boundsMin, boundsMax);
    onChange(Math.min(clamped, rightValue), rightValue);
  };

  const handleMaxChange = (nextMax: number) => {
    const clamped = clamp(nextMax, boundsMin, boundsMax);
    onChange(leftValue, Math.max(clamped, leftValue));
  };

  return (
    <div className={cn("mp-relative mp-mt-1 mp-h-6 mp-w-full", className)}>
      <div className="mp-absolute mp-top-1/2 mp-h-2 mp-w-full mp--translate-y-1/2 mp-rounded-full mp-bg-gray-200" />
      <div
        className="mp-absolute mp-top-1/2 mp-h-2 mp--translate-y-1/2 mp-rounded-full mp-bg-[var(--mp-primary,#085DE8)]"
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
        }}
      />

      <input
        type="range"
        min={boundsMin}
        max={boundsMax}
        value={leftValue}
        onChange={(event) => handleMinChange(Number(event.target.value))}
        className="mp-price-range-slider mp-price-range-slider-min"
        aria-label="Minimum price"
        data-testid="marketplace-price-range-min"
      />
      <input
        type="range"
        min={boundsMin}
        max={boundsMax}
        value={rightValue}
        onChange={(event) => handleMaxChange(Number(event.target.value))}
        className="mp-price-range-slider mp-price-range-slider-max"
        aria-label="Maximum price"
        data-testid="marketplace-price-range-max"
      />
    </div>
  );
};
