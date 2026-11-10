import { paymentListInclude, paymentListWhere } from "./payment-list.util";

describe("paymentListInclude", () => {
  it("loads the sale number customer store and totals", () => {
    expect(paymentListInclude.sale.select).toEqual({
      id: true,
      saleNumber: true,
      customerName: true,
      locationId: true,
      paymentStatus: true,
      totalAmount: true,
      status: true,
      location: { select: { id: true, name: true } },
    });
  });

  it("scopes payments to the business and optional store method and dates", () => {
    expect(paymentListWhere("biz-1", {})).toEqual({
      sale: { businessId: "biz-1" },
    });
    const where = paymentListWhere("biz-1", {
      locationId: "loc-1",
      method: "cash",
      startDate: "2026-10-01",
      endDate: "2026-10-31",
    });
    expect(where.sale).toEqual({ businessId: "biz-1", locationId: "loc-1" });
    expect(where.method).toBe("cash");
    expect(where.paidAt).toEqual(
      expect.objectContaining({ gte: new Date("2026-10-01") }),
    );
    expect((where.paidAt as { lte: Date }).lte).toBeInstanceOf(Date);
  });
});
