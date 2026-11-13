import type {
  MarketplaceProduct,
  MarketplaceSpecification,
} from "@raydahq/marketplace-ui";
import { IAsset, ISpecification } from "@/types/assets";

const mapSpecification = (spec: ISpecification): MarketplaceSpecification => ({
  id: spec.id,
  spec: Array.isArray(spec.spec) ? spec.spec : [],
  price: spec.asset_pricing ?? spec.price,
  isFavorited: spec.is_favourite,
  images: spec.images,
});

export const mapAssetToMarketplaceProduct = (
  asset?: IAsset | null,
): MarketplaceProduct | null => {
  if (!asset) return null;

  const specificationPrice = asset.specifications?.find(
    (spec) => spec.asset_pricing ?? spec.price,
  );

  return {
    id: asset.asset_spec_id ?? specificationPrice?.id ?? asset.id,
    specId: asset.asset_spec_id ?? specificationPrice?.id,
    name: asset.name,
    make: asset.make,
    model: asset.model,
    images: asset.images ?? [],
    spec: asset.spec ?? [],
    specifications: asset.specifications
      ?.filter((spec) => spec)
      .map(mapSpecification),
    price:
      asset.asset_pricing ??
      specificationPrice?.asset_pricing ??
      specificationPrice?.price,
    status: asset.status,
    isFavorited: asset.is_favourite,
    description: asset.description,
  };
};
