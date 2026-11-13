export type CashflowDay = {
  period: string | Date;
  inflowAmount: number;
  inflowCount: number;
  outflowAmount: number;
  outflowCount: number;
};

export type CashflowAnalytics = {
  inflowAmount: number;
  inflowCount: number;
  outflowAmount: number;
  outflowCount: number;
  series: CashflowDay[];
};

export type CustomerAnalyticsDay = {
  period: string | Date;
  spend: number;
  customers: number;
};

export type TopCustomerRow = {
  customerId: string;
  customerName: string;
  totalSpent: number;
  saleCount: number;
};

export type CustomerAnalytics = {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageSpend: number;
  series: CustomerAnalyticsDay[];
  topCustomers: TopCustomerRow[];
};
