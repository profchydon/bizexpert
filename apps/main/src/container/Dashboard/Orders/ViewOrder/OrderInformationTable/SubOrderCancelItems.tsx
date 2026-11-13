import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ISubOrder } from "@/types/orders";
import { formatStatus, getStatusBadgeVariant } from "./subOrderCancelMeta";

interface Props {
  subOrder?: ISubOrder;
}

export function SubOrderCancelItems({ subOrder }: Props) {
  const assets = subOrder?.assets || [];
  const equipment = subOrder?.equipment;

  if (assets.length > 0) {
    return assets.map((asset) => (
      <div
        key={asset.id}
        className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
      >
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
          {asset.images?.[0] ? (
            <Image
              src={asset.images[0]}
              alt={asset.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No img
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {asset.name}
          </p>
          <Badge
            className={`text-xs ${getStatusBadgeVariant(asset.status)}`}
            variant="outline"
          >
            {formatStatus(asset.status)}
          </Badge>
        </div>
      </div>
    ));
  }

  if (equipment) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
          {equipment.image_url ? (
            <Image
              src={equipment.image_url}
              alt={equipment.title || "Equipment"}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No img
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {equipment.title}
          </p>
          <Badge
            className={`text-xs ${getStatusBadgeVariant(subOrder?.status || "")}`}
            variant="outline"
          >
            {formatStatus(subOrder?.status || "")}
          </Badge>
        </div>
      </div>
    );
  }

  return <p className="text-sm text-gray-500">No items found</p>;
}
