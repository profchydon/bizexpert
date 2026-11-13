import React, { useState } from "react";
import HeaderText from "./HeaderText";
import TypeActions, { TypeActionsProp } from "./TypeActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { filterActionSchema } from "./validation";
import CheckboxDropdown from "./CheckboxDropdown";
import AssetStateActions from "./AssetStateActions";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { delete_icon } from "@/assets/icons";
import { Separator } from "@/components/ui/separator";
import PriceRangeAction, { PriceRangeActionProps } from "./PriceRangeAction";
import CategoryActions, { CategoryActionsProp } from "./CategoryActions";
import StateActions, { StateActionsProp } from "./StateActions";
import StorageActions, { StorageActionsProp } from "./StorageActions";
import MemoryActions, { MemoryActionsProp } from "./MemoryActions";

interface Props {
  currencySymbol?: string;
  priceRangeFilter: PriceRangeActionProps;
  typeFilter: TypeActionsProp;
  categoryFilter: CategoryActionsProp;
  stateFilter: StateActionsProp;
  storageFilter: StorageActionsProp;
  memoryFilter: MemoryActionsProp;
  onApplyFilter: () => void;
  resetFilter: () => void;
  isApplyFilterLoading: boolean;
}

const FilterActions: React.FC<Props> = ({
  currencySymbol,
  priceRangeFilter,
  typeFilter,
  categoryFilter,
  stateFilter,
  storageFilter,
  memoryFilter,
  onApplyFilter,
  isApplyFilterLoading,
  resetFilter,
}) => {
  const { selectedTypes, setSelectedTypes } = typeFilter;
  const { selectedCategories, setSelectedCategories } = categoryFilter;
  const { selectedState, setSelectedState } = stateFilter;
  const { selectedStorage, setSelectedStorage } = storageFilter;
  const { selectedMemory, setSelectedMemory } = memoryFilter;
  const { minPriceValue, maxPriceValue, setMaxPriceValue, setMinPriceValue } =
    priceRangeFilter;

  const form = useForm<z.infer<typeof filterActionSchema>>({
    resolver: zodResolver(filterActionSchema),
  });

  const onSubmit = (data: z.infer<typeof filterActionSchema>) => {};

  return (
    <aside className="hidden lg:flex lg:flex-col md:w-[300px]">
      <HeaderText />

      <Form {...form}>
        <form
          className="flex flex-col mt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <PriceRangeAction
            currencySymbol={currencySymbol!}
            minPriceValue={minPriceValue}
            maxPriceValue={maxPriceValue}
            setMinPriceValue={(value) => setMinPriceValue(value)}
            setMaxPriceValue={(value) => setMaxPriceValue(value)}
          />

          <Separator className="mt-4" />

          <CheckboxDropdown title="Category">
            <CategoryActions
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </CheckboxDropdown>

          <Separator className="mt-4" />

          <CheckboxDropdown title="Type">
            <TypeActions
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
          </CheckboxDropdown>

          <Separator className="mt-4" />

          <CheckboxDropdown title="Asset State">
            <StateActions
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
          </CheckboxDropdown>

          <Separator className="mt-4" />

          <CheckboxDropdown title="Hard Drive">
            <StorageActions
              selectedStorage={selectedStorage}
              setSelectedStorage={setSelectedStorage}
            />
          </CheckboxDropdown>

          <Separator className="mt-4" />

          <CheckboxDropdown title="RAM">
            <MemoryActions
              selectedMemory={selectedMemory}
              setSelectedMemory={setSelectedMemory}
            />
          </CheckboxDropdown>

          <div className="flex flex-row items-center justify-between mt-[2.5rem]">
            <Button
              disabled={isApplyFilterLoading}
              className="text-sm font-semibold w-full"
              onClick={onApplyFilter}
              data-testid="filteractions-button"
            >
              Apply Filter
            </Button>
            <Button
              type="button"
              className="w-auto"
              variant="ghost"
              onClick={resetFilter}
              data-testid="filteractions-button-2"
            >
              <Image
                src={delete_icon}
                alt="delete_icon"
                width={48}
                height={48}
              />
            </Button>
          </div>
        </form>
      </Form>
    </aside>
  );
};

export default FilterActions;
