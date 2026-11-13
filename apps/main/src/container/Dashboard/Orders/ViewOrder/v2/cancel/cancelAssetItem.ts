import { IAsset } from "@/types/assets";

type AssetCancelStatus = {
  can_cancel?: boolean;
  status?: string;
};

export function cancelAssetItem(
  asset: IAsset,
  employeeId: string,
  price: number,
  fulfillmentStage: string,
  subOrderCanCancel: boolean,
  subOrderCancelled: boolean,
) {
  const status = (asset as IAsset & { cancellation_status?: AssetCancelStatus })
    .cancellation_status;
  const stage = (status?.status || asset.status || "").toLowerCase();
  const isCancelled =
    stage === "cancelled" || stage === "order_cancelled" || subOrderCancelled;
  const cancelled =
    status && typeof status.can_cancel === "boolean"
      ? status.can_cancel !== true
      : !subOrderCanCancel;

  return {
    id: String(asset.id),
    lineId: asset.asset_order_id || String(asset.id),
    employeeId,
    name: asset.name || asset.model || "Device",
    price,
    fulfillmentStage,
    cancelled,
    isCancelled,
  };
}
