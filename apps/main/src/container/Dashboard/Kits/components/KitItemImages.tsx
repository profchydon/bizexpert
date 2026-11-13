import type { KitItemSummary } from "../types";
import KitPreviewImage from "./KitPreviewImage";

interface Props {
  items: KitItemSummary[] | undefined | null;
  limit?: number;
}

const KitItemImages = ({ items, limit = 5 }: Props) => {
  const summary = (items ?? []).slice(0, limit);
  const previewItems: KitItemSummary[] =
    summary.length > 0
      ? summary
      : [{ name: "Kit item placeholder", images: [], quantity: 0 }];

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {previewItems.map((item, index) => {
        const name = item.name ?? "Item";
        return (
          <KitPreviewImage
            key={`${name}-${index}`}
            src={item.images?.[0]}
            alt={name}
            width={42}
            height={42}
            containerClassName="size-14 shrink-0 rounded-md bg-gray-50 p-1.5"
            imageClassName="max-h-11 object-contain"
          />
        );
      })}
    </div>
  );
};

export default KitItemImages;
