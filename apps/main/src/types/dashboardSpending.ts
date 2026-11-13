export interface IDashboardSpendingPoint {
  index?: number;
  date?: string;
  month?: number;
  label: string;
  amount: number;
}

export interface IDashboardSpendingSeries {
  total: number;
  points: IDashboardSpendingPoint[];
}

export interface IDashboardSpendingOverTime {
  "7_days"?: IDashboardSpendingSeries;
  "30_days"?: IDashboardSpendingSeries;
  "12_months"?: IDashboardSpendingSeries;
}

export interface IDashboardSpendingWallet {
  available: number | string;
  limit: number | string;
  used_percent?: number | null;
  terms_label?: string | null;
}

export interface IDashboardSpendingMethod {
  over_time?: IDashboardSpendingOverTime;
  wallet?: IDashboardSpendingWallet;
}

export interface IDashboardSpendingPanel {
  all?: IDashboardSpendingMethod;
  credit?: IDashboardSpendingMethod;
  card?: IDashboardSpendingMethod;
  bank_transfer?: IDashboardSpendingMethod;
}
