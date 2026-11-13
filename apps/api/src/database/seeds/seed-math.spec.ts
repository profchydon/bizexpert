import { businessSlug, cartonSale, openingBalance } from "./seed-math";

describe("seed-math", () => {
  it("slugs the demo business name", () => {
    expect(businessSlug("Demo Wholesalers Ltd")).toBe("demo-wholesalers-ltd");
  });

  it("computes opening stock value from quantity and unit cost", () => {
    expect(openingBalance(240, 350)).toEqual({
      quantity: 240,
      averageCost: 350,
      totalValue: 84000,
    });
  });

  it("computes the demo drinks carton sale totals", () => {
    expect(
      cartonSale({
        cartonQty: 3,
        conversionFactor: 24,
        unitPrice: 11500,
        unitCost: 350,
      }),
    ).toEqual({
      quantityInBase: 72,
      lineTotal: 34500,
      lineCost: 25200,
      lineProfit: 9300,
    });
  });
});
