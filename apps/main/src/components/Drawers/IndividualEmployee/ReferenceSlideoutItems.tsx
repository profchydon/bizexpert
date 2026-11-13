import { Package } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import { IAsset } from "@/types/assets";
import { SlideoutItem } from "./slideoutData";

interface Props {
  items: SlideoutItem[];
  onView: (asset: IAsset) => void;
}

export default function ReferenceSlideoutItems({
  items,
  onView,
}: Readonly<Props>) {
  return (
    <div className="border-b border-[#eaecf0] px-6 py-4">
      <p className="text-sm font-medium text-[#344054]">Items</p>
      <p className="mt-0.5 text-sm text-[#475467]">
        The following items are included in this order.
      </p>
      <div className="mt-3 flex flex-col divide-y divide-[#eaecf0]">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 py-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f9fafb]">
              {item.image ? (
                <SafeImage
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-5 w-5 text-[#717680]" />
              )}
            </div>
            <p className="flex-1 truncate text-sm font-semibold text-[#344054]">
              {item.label}
            </p>
            {item.asset && (
              <button
                type="button"
                onClick={() => onView(item.asset as IAsset)}
                className="shrink-0 text-sm font-semibold text-[#003999] hover:underline"
              >
                View
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-4 text-sm text-gray-500">No items available</p>
        )}
      </div>
    </div>
  );
}
