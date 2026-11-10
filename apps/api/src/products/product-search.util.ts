export function productSearchOr(q: string) {
  return [
    { name: { contains: q, mode: 'insensitive' as const } },
    { sku: { contains: q, mode: 'insensitive' as const } },
    { barcode: { contains: q, mode: 'insensitive' as const } },
    { category: { contains: q, mode: 'insensitive' as const } },
  ];
}
