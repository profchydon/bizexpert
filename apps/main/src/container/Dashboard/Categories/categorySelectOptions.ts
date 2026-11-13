import type { Category } from "@/types/bizexpert";
import {
  isMainCategory,
  subCategoriesForParent,
} from "./categoryHierarchyDisplay";

export function mainCategorySelectOptions(
  categories: Category[],
  current?: string,
): { value: string; label: string }[] {
  const names = categories.filter(isMainCategory).map((row) => row.name);
  const extra = current?.trim();
  if (
    extra &&
    !names.some((name) => name.toLowerCase() === extra.toLowerCase())
  ) {
    names.push(extra);
  }
  return [
    { value: "", label: "None" },
    ...names.map((name) => ({ value: name, label: name })),
  ];
}

export function subCategorySelectOptions(
  categories: Category[],
  mainCategoryName?: string,
  current?: string,
): { value: string; label: string }[] {
  if (!mainCategoryName?.trim()) {
    return [{ value: "", label: "Select a category first" }];
  }
  const parent = categories.find(
    (row) =>
      isMainCategory(row) &&
      row.name.toLowerCase() === mainCategoryName.trim().toLowerCase(),
  );
  if (!parent) {
    return [{ value: "", label: "None" }];
  }
  const names = subCategoriesForParent(categories, parent.id).map(
    (row) => row.name,
  );
  const extra = current?.trim();
  if (
    extra &&
    !names.some((name) => name.toLowerCase() === extra.toLowerCase())
  ) {
    names.push(extra);
  }
  return [
    { value: "", label: "None" },
    ...names.map((name) => ({ value: name, label: name })),
  ];
}

export const categorySelectOptions = mainCategorySelectOptions;
