export function normalizeCategoryName(name: string): string {
  return name.trim();
}

export function categoryKey(name: string): string {
  return normalizeCategoryName(name).toLowerCase();
}

export function namesMatch(left: string, right: string): boolean {
  return categoryKey(left) === categoryKey(right);
}

export function findNameConflict<T extends { id: string; name: string }>(
  existing: T[],
  name: string,
  excludeId?: string,
): T | undefined {
  const key = categoryKey(name);
  return existing.find(
    (row) => row.id !== excludeId && categoryKey(row.name) === key,
  );
}

export function namesToBackfill(
  existingNames: string[],
  productNames: Array<string | null | undefined>,
): string[] {
  const have = new Set(existingNames.map(categoryKey));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of productNames) {
    const name = raw?.trim();
    if (!name) continue;
    const key = categoryKey(name);
    if (have.has(key) || seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result;
}

export function canDeleteCategory(productCount: number): boolean {
  return productCount === 0;
}
