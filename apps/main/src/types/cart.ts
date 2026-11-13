import { IAsset, ISpecification } from "./assets";

interface IPricing {
  id: string;
  amount: string;
  currency_code?: string;
  tax?: null | string;
  country_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
  asset_specification_id: string;
}

export interface ICartCountry {
  id?: string;
  code?: string;
  name?: string;
  label?: string;
}

export interface ICart {
  asset: IAsset;
  specification: ISpecification;
  pricing: IPricing;
  quantity: number;
  amount: string;
  source?: string | null;
  storage?: boolean;
  storageDuration?: string;
  equipmentId?: string;
  country?: ICartCountry;
  images: null | string | string[];
  device_setup?: unknown;
  fulfillment_date?: string;
  recipientName?: string;
  recipientCountry?: string;
  employeeId?: string;
  actionType?: string;
  action_type?: string;
}
