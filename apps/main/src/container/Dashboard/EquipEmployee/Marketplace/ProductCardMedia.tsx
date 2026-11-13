import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { product_1 } from "@/assets/images";
import { IAsset } from "@/types/assets";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardMediaProps {
  asset?: IAsset;
  isFavorited?: boolean;
  onOpenDetails: () => void;
  onToggleFavorite?: (id: string) => void;
}

const ProductCardMedia: React.FC<ProductCardMediaProps> = ({
  asset,
  isFavorited,
  onOpenDetails,
  onToggleFavorite,
}) => (
  <div className="relative h-[156px] w-full overflow-clip rounded-2xl bg-gray-100">
    <motion.div
      className="absolute top-2 right-2 z-10"
      animate={isFavorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        onClick={(event) => {
          event.stopPropagation();
          const favoriteId = asset?.asset_spec_id ?? asset?.id;
          if (favoriteId) {
            onToggleFavorite?.(favoriteId);
          }
        }}
        className="h-8 w-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
        data-testid="productcardmedia-button"
      >
        <Heart
          className={cn(
            "h-4 w-4 text-gray-500",
            isFavorited && "fill-primary-600 text-primary-600",
          )}
        />
      </Button>
    </motion.div>

    <button type="button" className="h-full w-full p-4" onClick={onOpenDetails}>
      <Image
        src={asset?.images[0] ?? product_1}
        alt={asset?.name ?? "asset"}
        width={220}
        height={156}
        className="size-full rounded-2xl object-contain"
      />
    </button>
  </div>
);

export default ProductCardMedia;
