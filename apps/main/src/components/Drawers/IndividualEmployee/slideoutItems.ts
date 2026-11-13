import { IAsset } from "@/types/assets";
import { ISubOrder } from "@/types/orders";
import { joinLabelParts } from "./slideoutLabel";

export interface SlideoutItem {
  id: string;
  label: string;
  image?: string;
  asset?: IAsset;
}

function resolveItems(subOrder: ISubOrder | undefined): SlideoutItem[] {
  const assets = Array.isArray(subOrder?.assets) ? subOrder.assets : [];
  if (assets.length) {
    return assets.map((asset) => ({
      id: asset.id || asset.name,
      label: joinLabelParts(asset.name, asset.make, asset.model) || asset.name,
      image: asset.images?.[0],
      asset,
    }));
  }
  const equipment = subOrder?.equipment;
  if (equipment) {
    return [
      {
        id: equipment.id || equipment.title,
        label:
          joinLabelParts(equipment.title, equipment.make) || equipment.title,
        image: equipment.image_url || undefined,
      },
    ];
  }
  return [];
}

export function resolveSlideoutItems(subOrders: ISubOrder[]): SlideoutItem[] {
  return subOrders.flatMap((subOrder) => resolveItems(subOrder));
}
