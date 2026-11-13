import { ISpecification } from "./assets";
import { ICart } from "./cart";
import { ActionType, Offboard_asset } from "./offboarding";

interface IPricing {
  id: string;
  amount: string;
  tax?: null | string;
  country_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
  asset_specification_id: string;
}

export interface IBuyToStorage extends Offboard_asset {
  specification: ISpecification;
  pricing: IPricing;
  quantity: number;
  amount: string;
  images: null | string | string[];
}
