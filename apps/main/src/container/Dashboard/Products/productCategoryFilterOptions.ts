import type { Category } from "@/types/bizexpert";
import { mainCategories } from "../Categories/categoryHierarchyDisplay";

export function productCategoryFilterOptions(categories: Category[]) {
  return [
    { value: "", label: "All categories" },
    ...mainCategories(categories).map((row) => ({
      value: row.name,
      label: row.name,
    })),
  ];
}
