import type { MarketplaceProduct } from "../types";

export const resolveProductGalleryImages = (
  product: MarketplaceProduct,
  specId?: string,
): string[] => {
  const currentSpec = product.specifications?.find(
    (spec) => spec.id === specId,
  );

  if (currentSpec?.images?.length) {
    return currentSpec.images;
  }

  return product.images ?? [];
};
