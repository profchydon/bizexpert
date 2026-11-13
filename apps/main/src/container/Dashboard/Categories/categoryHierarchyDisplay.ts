import type { Category } from "@/types/bizexpert";

export function isMainCategory(category: Category): boolean {
  return !category.parentId;
}

export function mainCategories(categories: Category[]): Category[] {
  return categories.filter(isMainCategory);
}

export function subCategoriesForParent(
  categories: Category[],
  parentId: string,
): Category[] {
  return categories.filter((row) => row.parentId === parentId);
}

export function sortCategoriesForTable(categories: Category[]): Category[] {
  const mains = mainCategories(categories).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const result: Category[] = [];
  for (const main of mains) {
    result.push(main);
    const subs = subCategoriesForParent(categories, main.id).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    result.push(...subs);
  }
  const orphanSubs = categories
    .filter((row) => row.parentId && !mains.some((m) => m.id === row.parentId))
    .sort((a, b) => a.name.localeCompare(b.name));
  result.push(...orphanSubs);
  return result;
}
