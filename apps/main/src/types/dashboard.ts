import { ICatalog } from "./catalog";
import type { IDashboardSpendingPanel } from "./dashboardSpending";
import { IEmployeeRequest } from "./employees";

export interface ICard {
  total_employees: number;
  total_inventory: number;
  total_active_orders: number;
  total_active_catalogs: number;
  total_order_value: number;
}
export interface IOrderFrequency {
  month: string;
  count: number;
}
export interface IEquipmentByCountry {
  country: string;
  count: number;
  flag: string;
}
export interface IEquipmentByCategory {
  category: string;
  count: number;
}
export interface IRecentOrders {
  id: string;
  order_number: string;
  status: string;
  type: string | null;
  country: string;
  currency: string;
  country_code: string;
  order_date: string;
}

export interface IWalletHistory {
  daily_snapshot: {
    balance: string;
    date: string;
    month: string;
    frequency: string;
    day: string;
  }[];
  weekly_snapshot: {
    balance: string;
    date: string;
    month: string;
    frequency: string;
    day: string;
  }[];
  yearly_snapshot: {
    balance: string;
    date: string;
    month: string;
    frequency: string;
  }[];
}

export interface IWallet {
  wallet: {
    current_balance: string;
    current_limit: string;
  };
  wallet_history: IWalletHistory;
}

export interface IDashboardCatalogPolicyCoverage {
  covered: number;
  total: number;
  percent: number;
}

export interface IDashboardCatalogPolicyStatus {
  total: number;
  active: number;
  draft: number;
}

export interface IDashboardCatalogPolicyPanel {
  employee_coverage: IDashboardCatalogPolicyCoverage;
  policy_status: IDashboardCatalogPolicyStatus;
  kits_assigned: number;
}

export interface IDashboardAccess {
  scope?: string;
  visibility?: {
    overview?: boolean;
    catalog_policy?: boolean;
    spending?: boolean;
    ordering?: boolean;
    equipment?: boolean;
    offices?: boolean;
    country?: boolean;
    export?: boolean;
  };
}

export interface IDashboardOrderingPanel {
  frequency: Array<{ month: number; label: string; count: number }>;
  types_breakdown?: IEquipmentByCategory[];
  recent_orders?: IRecentOrders[];
}

export type {
  IDashboardSpendingMethod,
  IDashboardSpendingOverTime,
  IDashboardSpendingPanel,
  IDashboardSpendingPoint,
  IDashboardSpendingSeries,
  IDashboardSpendingWallet,
} from "./dashboardSpending";

export interface IDashboardEquipmentCondition {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

export interface IDashboardEquipmentPanel {
  total_assets: number;
  in_storage: number;
  asset_value: number;
  condition: IDashboardEquipmentCondition;
  mix_by_category: IEquipmentByCategory[];
}

export interface IDashboardOfficeArea {
  name: string;
  count: number;
}

export interface IDashboardOfficesPanel {
  total: number;
  physical: number;
  remote: number;
  areas: IDashboardOfficeArea[];
}

export interface IDashboard {
  cards: ICard;
  order_frequency: IOrderFrequency[];
  equipment_by_country: IEquipmentByCountry[];
  equipment_by_category: IEquipmentByCategory[];
  recent_orders: IRecentOrders[];
  recent_catalogs: ICatalog[];
  recent_catalog_order_requests: IEmployeeRequest[];
  wallet: IWallet;
  access?: IDashboardAccess;
  panels?: {
    overview?: ICard;
    catalog_policy?: IDashboardCatalogPolicyPanel;
    spending?: IDashboardSpendingPanel;
    ordering?: IDashboardOrderingPanel;
    equipment?: IDashboardEquipmentPanel;
    offices?: IDashboardOfficesPanel;
  };
}

export interface IDashboardCountrySummary {
  country_id: string;
  country_code: string;
  country: string;
  employee_count: number;
  equipment_count: number;
  equipment_in_storage_count: number;
  catalog_count: number;
}
