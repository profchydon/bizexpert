import { IAsset } from "./assets";
import { ICountry } from "./auth";
import { IDepartment, ILevel } from "./departments";
import { IEmployees } from "./employees";

export interface ICatalogConfig {
  auto_share: boolean;
  auto_approve?: boolean;
  budget_count: number;
  budget_limit: string;
  id: string;
  time_duration: "days" | "months" | "weeks";
  time_limit: number;
}

export interface ICatalog {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  type?: "budget" | "device";
  status?: "active" | "inactive" | "expired";
  asset_count?: number;
  assets?: {
    data: IAsset[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  country?: ICountry | null;
  countries?: ICountry[];
  departments: IDepartment[];
  levels: ILevel[];
  created_at?: string;
  updated_at?: string;
  categories?: { name: string; quantity: number }[];
  config?: ICatalogConfig;
  total_amount: number;
  total_requests: number;
  approved_requests?: number;
}
