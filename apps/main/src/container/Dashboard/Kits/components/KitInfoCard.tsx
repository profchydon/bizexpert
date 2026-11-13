import type { Kit } from "../types";
import {
  formatItemsCount,
  formatKitDate,
  itemPreviewImage,
  itemPreviewName,
  itemPreviewUsesPlaceholder,
} from "../utils";
import KitPreviewImage from "./KitPreviewImage";
import FulfillmentBadge from "./FulfillmentBadge";
import KitStatusBadge from "./KitStatusBadge";

interface Props {
  kit: Kit;
}

const KitInfoCard = ({ kit }: Props) => {
  const previews =
    kit.items && kit.items.length > 0 ? kit.items : (kit.items_summary ?? []);
  const products = previews.slice(0, 4).map((item) => ({
    name: itemPreviewName(item),
    image: itemPreviewImage(item),
    isPlaceholder: itemPreviewUsesPlaceholder(item),
  }));

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <KitPreviewImage
              key={`${product.name ?? "item"}-${index}`}
              src={product.image}
              alt={product.name ?? "Item"}
              width={80}
              height={80}
              isPlaceholder={product.isPlaceholder}
              containerClassName="aspect-square rounded-md bg-white p-2"
              imageClassName="object-contain"
              labelClassName="bottom-1 px-1.5 py-0.5 text-[8px]"
            />
          ))
        ) : (
          <KitPreviewImage
            src={null}
            alt="Kit item placeholder"
            width={140}
            height={100}
            containerClassName="col-span-2 aspect-video rounded-md bg-white p-4"
            imageClassName="max-h-full w-auto object-contain"
            labelClassName="bottom-2 px-2 py-1 text-[10px]"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FulfillmentBadge mode={kit.fulfillment_mode} />
        <KitStatusBadge status={kit.status} />
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <InfoRow label="Updated" value={formatKitDate(kit.updated_at)} />
        <InfoRow label="Items" value={formatItemsCount(kit.items_count)} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default KitInfoCard;
