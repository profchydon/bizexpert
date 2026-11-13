import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardFavoriteButtonProps {
  isFavorited?: boolean;
  onClick: () => void;
}

const ProductCardFavoriteButton: React.FC<ProductCardFavoriteButtonProps> = ({
  isFavorited,
  onClick,
}) => {
  return (
    <motion.div
      className="absolute top-3 right-3 z-10"
      animate={isFavorited ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        className="rounded-full bg-white p-2 ring-1 ring-primary-200 hover:bg-gray-100"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            "h-4 w-4 text-gray-500",
            isFavorited && "fill-primary-600 text-primary-600",
          )}
        />
      </button>
    </motion.div>
  );
};

export default ProductCardFavoriteButton;
