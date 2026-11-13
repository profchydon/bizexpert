import FormField from "@/components/Custom/FormField";
import React, { FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DualRangeSlider } from "@/components/ui/slider";
import formatAmount from "@/utils/formatAmount";

export interface PriceRangeActionProps {
  minPriceValue: string;
  maxPriceValue: string;
  setMaxPriceValue: (value: string) => void;
  setMinPriceValue: (value: string) => void;
}

const PriceRangeAction: FC<
  PriceRangeActionProps & { currencySymbol: string }
> = ({
  minPriceValue,
  maxPriceValue,
  setMaxPriceValue,
  setMinPriceValue,
  currencySymbol,
}) => {
  const [displayMinPrice, setDisplayMinPrice] = useState(minPriceValue);
  const [displayMaxPrice, setDisplayMaxPrice] = useState(maxPriceValue);

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
    <div>
      <h3 className="title_text font-semibold mb-2">Price</h3>
      <div className="flex flex-row items-center gap-x-4">
        <FormField
          name="from"
          label="From"
          className="!font-normal"
          render={({ field }) => (
            <Input
              value={displayMinPrice || ""}
              onChange={handleMinPriceChange}
              placeholder={currencySymbol}
              type="text"
              data-testid="pricerangeaction-input"
            />
          )}
        />
        <FormField
          name="to"
          label="To"
          className="!font-normal"
          render={({ field }) => (
            <Input
              value={displayMaxPrice || ""}
              onChange={handleMaxPriceChange}
              placeholder={currencySymbol}
              type="text"
              data-testid="pricerangeaction-input-2"
            />
          )}
        />
      </div>
      <div className="w-full mt-2.5">
        <DualRangeSlider
          value={[Number(minPriceValue) || 0, Number(maxPriceValue) || 0]}
          onValueChange={(value) => {
            setMinPriceValue(value[0].toString());
            setMaxPriceValue(value[1].toString());
          }}
          min={1000}
          max={1000000}
          step={1}
        />
      </div>
    </div>
  );
};

export default PriceRangeAction;
