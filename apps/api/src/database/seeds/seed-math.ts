export function businessSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function openingBalance(quantity: number, unitCost: number) {
  return {
    quantity,
    averageCost: unitCost,
    totalValue: quantity * unitCost,
  };
}

export function cartonSale(input: {
  cartonQty: number;
  conversionFactor: number;
  unitPrice: number;
  unitCost: number;
}) {
  const quantityInBase = input.cartonQty * input.conversionFactor;
  const lineTotal = input.unitPrice * input.cartonQty;
  const lineCost = quantityInBase * input.unitCost;
  return {
    quantityInBase,
    lineTotal,
    lineCost,
    lineProfit: lineTotal - lineCost,
  };
}
