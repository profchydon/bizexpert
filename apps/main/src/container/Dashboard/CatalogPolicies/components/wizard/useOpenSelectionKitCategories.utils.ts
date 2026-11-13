export function uniqueKitCategoryIds(
  data?: { categories?: { id?: string | null }[] }[] | null,
) {
  return Array.from(
    new Set(
      (data ?? []).flatMap((kit) =>
        (kit.categories ?? [])
          .map((category) => category.id)
          .filter((id): id is string => Boolean(id)),
      ),
    ),
  );
}
