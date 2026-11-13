import type { MarketplacePriceRangeFilter } from "../../types";
import { PriceRangeSlider } from "./PriceRangeSlider";

export interface PriceRangeInputsProps extends MarketplacePriceRangeFilter {
  currencySymbol?: string;
}

const DEFAULT_BOUNDS: [number, number] = [0, 1_000_000];

export const PriceRangeInputs = ({
  currencySymbol,
  minPriceValue,
  maxPriceValue,
  setMinPriceValue,
  setMaxPriceValue,
  bounds,
}: PriceRangeInputsProps) => {
  const [boundsMin, boundsMax] = bounds ?? DEFAULT_BOUNDS;
  const sliderMin =
    Number.isFinite(minPriceValue) && minPriceValue > 0
      ? minPriceValue
      : boundsMin;
  const sliderMax =
    Number.isFinite(maxPriceValue) && maxPriceValue > 0
      ? maxPriceValue
      : boundsMax;

  return (
    <div className="mp-flex mp-flex-col mp-gap-2.5 mp-px-3.5">
      <div className="mp-flex mp-gap-6">
        <div className="mp-flex mp-flex-1 mp-flex-col mp-gap-1.5">
          <label
            htmlFor="marketplace-price-from"
            className="mp-text-sm mp-font-medium mp-text-gray-600"
          >
            From
          </label>
          <div className="mp-flex mp-items-center mp-rounded-lg mp-border mp-border-gray-300 mp-bg-white mp-px-3 mp-py-2 mp-shadow-xs">
            {currencySymbol && (
              <span className="mp-text-base mp-text-gray-500">
                {currencySymbol}
              </span>
            )}
            <input
              id="marketplace-price-from"
              type="text"
              inputMode="numeric"
              value={minPriceValue || ""}
              placeholder="0"
              onChange={(event) => {
                const rawValue = event.target.value.replaceAll(",", "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  setMinPriceValue(rawValue === "" ? 0 : Number(rawValue));
                }
              }}
              className="mp-ml-2 mp-w-full mp-bg-transparent mp-text-base mp-text-gray-900 mp-outline-none placeholder:mp-text-gray-400"
              data-testid="marketplace-price-from-input"
            />
          </div>
        </div>

        <div className="mp-flex mp-flex-1 mp-flex-col mp-gap-1.5">
          <label
            htmlFor="marketplace-price-to"
            className="mp-text-sm mp-font-medium mp-text-gray-600"
          >
            To
          </label>
          <div className="mp-flex mp-items-center mp-rounded-lg mp-border mp-border-gray-300 mp-bg-white mp-px-3 mp-py-2 mp-shadow-xs">
            {currencySymbol && (
              <span className="mp-text-base mp-text-gray-500">
                {currencySymbol}
              </span>
            )}
            <input
              id="marketplace-price-to"
              type="text"
              inputMode="numeric"
              value={maxPriceValue || ""}
              placeholder="0"
              onChange={(event) => {
                const rawValue = event.target.value.replaceAll(",", "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  setMaxPriceValue(rawValue === "" ? 0 : Number(rawValue));
                }
              }}
              className="mp-ml-2 mp-w-full mp-bg-transparent mp-text-base mp-text-gray-900 mp-outline-none placeholder:mp-text-gray-400"
              data-testid="marketplace-price-to-input"
            />
          </div>
        </div>
      </div>

      <PriceRangeSlider
        minValue={sliderMin}
        maxValue={sliderMax}
        boundsMin={boundsMin}
        boundsMax={boundsMax}
        onChange={(min, max) => {
          setMinPriceValue(min);
          setMaxPriceValue(max);
        }}
      />
    </div>
  );
};
