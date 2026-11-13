import type { Category } from "@/types/bizexpert";

export function filterCategoriesBySearch(
  categories: Category[],
  query: string,
): Category[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return categories;
  return categories.filter((category) => {
    const parent = category.parentName?.toLowerCase() ?? "";
    return (
      category.name.toLowerCase().includes(needle) || parent.includes(needle)
    );
  });
}
