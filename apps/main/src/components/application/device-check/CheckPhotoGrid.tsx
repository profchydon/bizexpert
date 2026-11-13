import { SafeImage } from "@/components/SafeImage";
import { Button as AriaButton } from "react-aria-components";

interface Props {
  photos: string[];
  onOpen: (index: number) => void;
}

const MAX_TILES = 5;

export function CheckPhotoGrid({ photos, onOpen }: Props) {
  if (!photos.length) return null;
  const visible = photos.slice(0, MAX_TILES);
  const overflow = photos.length - visible.length;

  return (
    <div className="grid grid-cols-5 gap-2">
      {visible.map((p, i) => (
        <AriaButton
          key={p}
          onPress={() => onOpen(i)}
          aria-label={`Open photo ${i + 1}`}
          className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-secondary outline-hidden transition hover:ring-brand"
        >
          <SafeImage
            src={p}
            alt=""
            width={80}
            height={80}
            className="size-full object-cover"
          />
          {overflow > 0 && i === visible.length - 1 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
              +{overflow}
            </span>
          )}
        </AriaButton>
      ))}
    </div>
  );
}
