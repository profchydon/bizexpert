export type SalesSummary = {
  totalRevenue?: number;
  totalCost?: number;
  grossProfit?: number;
  grossMarginPct?: number;
  completedSalesCount?: number;
  averageOrderValue?: number;
};

export type CollectionSummary = {
  totalRevenue: number;
  cashCollected: number;
  outstandingCredit: number;
};

export type InventoryValuationSummary = {
  totalValue: number;
};

export type InventoryOverviewMetric = {
  id: string;
  title: string;
  value: string;
  hint?: string;
};

export type InventoryChartPoint = {
  period: string | Date;
  revenue: number;
  profit: number;
  salesCount?: number;
};

export type InventoryLowStockRow = {
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  currentStock: string;
  threshold: string;
  category?: string;
};

export type InventoryTopProductRow = {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalProfit: number;
  totalQuantity: number;
};

export type InventoryLocationRow = {
  locationId: string;
  locationName: string;
  totalRevenue: number;
  totalProfit: number;
  totalCost: number;
  salesCount: number;
};
