import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAssetCategoriesQuery } from "@/api/baseQueries/assetsApi/getAssetCategories";

export interface CategoryActionsProp {
  setSelectedCategories: (value: string[]) => void;
  selectedCategories: string[];
}
const CategoryActions: FC<CategoryActionsProp> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { data: categoriesRes, isLoading } = useGetAssetCategoriesQuery();
  const categories = categoriesRes?.data ?? [];

  return (
    <>
      {categories.map((item) => (
        <FormField
          key={item.id}
          name={"type"}
          render={() => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={selectedCategories.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedCategories([
                            ...selectedCategories,
                            item?.id,
                          ])
                        : setSelectedCategories(
                            selectedCategories.filter(
                              (value) => value !== item?.id,
                            ),
                          );
                    }}
                    data-testid="categoryactions-checkbox"
                  />
                </FormControl>
                <FormLabel className="font-normal">{item.name}</FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export default CategoryActions;
