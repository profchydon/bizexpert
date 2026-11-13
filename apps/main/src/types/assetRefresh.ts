import { Offboard_asset } from "./offboarding";

export type REFRESH_ASSET_STATUS = "Due" | "Overdue" | "Not Due";

export interface IAssetRefresh {
  asset_type_id: string;
  refresh_period_in_months?: number | string;
}

export interface IDeviceRefreshDetails {
  months_till_due: string;
  refresh_status: REFRESH_ASSET_STATUS;
}

export interface IAssetRefreshItem extends IAssetRefresh {
  asset_type: string;
}

export interface IAssetRefreshList extends Offboard_asset {
  items?: IAssetRefresh[];
}

export interface ICreateRefreshDevice {
  refresh_list: IAssetRefresh[];
}

export type CreateRefreshDeviceRequest = {
  companyId: string;
  payload: ICreateRefreshDevice;
};

export const refrshAssetStatusMap: Record<
  REFRESH_ASSET_STATUS,
  {
    className: string;
    variant?: string;
    label: string;
    icon?: React.ReactNode;
  }
> = {
  Due: {
    className: "w-fit",
    variant: "pending",
    label: "Due",
  },
  Overdue: {
    className: "w-fit",
    variant: "red",
    label: "Overdue",
  },
  "Not Due": {
    className: "w-fit",
    variant: "gray",
    label: "Not Due",
  },
};
