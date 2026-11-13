import React, { FC, useEffect, useState } from "react";
import { DualRangeSlider } from "@/components/ui/slider";
import formatAmount from "@/utils/formatAmount";

export interface PriceRangeActionProps {
  minPriceValue: string;
  maxPriceValue: string;
  setMaxPriceValue: (value: string) => void;
  setMinPriceValue: (value: string) => void;
  bounds?: {
    min: number;
    max: number;
  };
}

const PriceRangeAction: FC<
  PriceRangeActionProps & { currencySymbol: string }
> = ({
  minPriceValue,
  maxPriceValue,
  setMaxPriceValue,
  setMinPriceValue,
  currencySymbol,
  bounds,
}) => {
  const [displayMinPrice, setDisplayMinPrice] = useState(minPriceValue);
  const [displayMaxPrice, setDisplayMaxPrice] = useState(maxPriceValue);
  const sliderValue = [
    Number(minPriceValue) || bounds?.min || 1000,
    Number(maxPriceValue) || bounds?.max || 1000000,
  ];

  useEffect(() => {
    setDisplayMinPrice(
      minPriceValue && !Number.isNaN(Number(minPriceValue))
        ? formatAmount(minPriceValue)
        : "",
    );
  }, [minPriceValue]);

  useEffect(() => {
    setDisplayMaxPrice(
      maxPriceValue && !Number.isNaN(Number(maxPriceValue))
        ? formatAmount(maxPriceValue)
        : "",
    );
  }, [maxPriceValue]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replaceAll(",", "");
    setMinPriceValue(rawValue);
    setDisplayMinPrice(rawValue);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replaceAll(",", "");
    setMaxPriceValue(rawValue);
    setDisplayMaxPrice(rawValue);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="px-3.5 py-2.5">
        <h3 className="text-gray-900 text-lg font-semibold">Price</h3>
      </div>

      <div className="flex flex-col gap-2.5 px-3.5 pb-2.5">
        <div className="flex gap-6">
          <div className="flex flex-1 flex-col gap-1.5">
            <label
              htmlFor="marketplace-price-from"
              className="text-sm font-medium text-gray-600"
            >
              From
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
              <span className="text-base text-gray-500">{currencySymbol}</span>
              <input
                id="marketplace-price-from"
                value={displayMinPrice || ""}
                onChange={handleMinPriceChange}
                placeholder="0"
                type="text"
                inputMode="numeric"
                className="ml-2 w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
                data-testid="pricerangeaction-input"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label
              htmlFor="marketplace-price-to"
              className="text-sm font-medium text-gray-600"
            >
              To
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
              <span className="text-base text-gray-500">{currencySymbol}</span>
              <input
                id="marketplace-price-to"
                value={displayMaxPrice || ""}
                onChange={handleMaxPriceChange}
                placeholder="0"
                type="text"
                inputMode="numeric"
                className="ml-2 w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
                data-testid="pricerangeaction-input-2"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <DualRangeSlider
            value={sliderValue}
            onValueChange={(value) => {
              setMinPriceValue(value[0].toString());
              setMaxPriceValue(value[1].toString());
            }}
            min={bounds?.min || 1000}
            max={bounds?.max || 1000000}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeAction;
