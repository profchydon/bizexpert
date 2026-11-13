import type { Category } from "@/types/bizexpert";
import { subCategoriesForParent } from "../Categories/categoryHierarchyDisplay";

export function productSubCategoryFilterOptions(
  categories: Category[],
  mainCategoryName: string,
) {
  const parent = categories.find(
    (row) =>
      !row.parentId &&
      row.name.toLowerCase() === mainCategoryName.trim().toLowerCase(),
  );
  if (!parent) {
    return [{ value: "", label: "All sub-categories" }];
  }
  const subs = subCategoriesForParent(categories, parent.id);
  return [
    { value: "", label: "All sub-categories" },
    ...subs.map((row) => ({ value: row.name, label: row.name })),
  ];
}
