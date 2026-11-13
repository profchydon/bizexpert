export function getPriceRange(
  data: Record<string, number>,
): { minimum: number; maximum: number } | null {
  if (Object?.keys(data)?.length === 0) return null;

  const values = Object?.values(data);
  return {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}
