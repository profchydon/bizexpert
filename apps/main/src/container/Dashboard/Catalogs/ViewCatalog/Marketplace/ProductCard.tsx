import { Button } from "@/components/ui/button";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IAsset } from "@/types/assets";
import Image from "next/image";
import { product_1 } from "@/assets/images";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/routes";
import millify from "millify";
import Link from "next/link";
import createQueryString from "@/utils/createQueryString";
import { useEffect, useRef } from "react";
import { useAddAssetsToCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/addAssetsToCatalog";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { ICatalog } from "@/types/catalog";
import useCatalog from "@/hooks/useCatalog";

interface Props {
  asset?: IAsset;
  isLoading: boolean;
  catalog?: ICatalog;
  catalogId: string;
  setIsLoading: (value: boolean) => void;
}

const ProductCard: React.FC<Props> = ({
  asset,
  isLoading,
  setIsLoading,
  catalog,
  catalogId,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const catalogAssets =
    catalog?.assets?.data?.map((asset) => asset.asset_pricing.id) ?? [];

  const assetSpecs = asset?.spec.map((spec) => spec.value).join(" ");

  const { handleAddAssets, isAddAssetsLoading } = useCatalog(catalog!);

  const isAssetAdded = catalogAssets.includes(asset?.asset_pricing.id!);

  useEffect(() => {
    if (isAddAssetsLoading) {
      setIsLoading(true);
    }
  }, [isAddAssetsLoading]);

  return (
    <Card
      className={`flex flex-col p-4 w-full bg-white border border-gray-200 rounded-lg min-h-[306px] max-h-[306px]`}
    >
      <CardHeader
        className="flex flex-col cursor-pointer items-center justify-center h-[156px] bg-gray-100 rounded-lg"
        onClick={() =>
          router.push(
            `${routes.CATALOGS_MARKETPLACE}/${asset?.asset_id}?${createQueryString("specId", asset?.asset_spec_id!)}&catalogId=${catalogId}`,
          )
        }
      >
        <div className="w-auto max-h-[106px] min-h-[106px] h-[106px]">
          <Image
            src={asset?.images[0] ?? product_1}
            alt={asset?.name!}
            width={150}
            height={106}
            className="object-contain w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3 flex flex-col gap-y-4">
        <Link
          href={{
            pathname: `${pathname}/${asset?.asset_id}`,
            query: { specId: asset?.asset_spec_id, catalogId },
          }}
        >
          <h3
            className="text-gray-900 font-semibold text-sm line-clamp-2"
            title={`${asset?.name} ${assetSpecs}`}
          >
            {asset?.name} {assetSpecs}
          </h3>
        </Link>
        <div className="flex flex-row items-end justify-between">
          <div>
            <label className="text-gray-500 font-normal text-[12px]">
              Price
            </label>
            <h2 className="text-black font-semibold text-lg">
              {asset?.asset_pricing.currency.symbol}{" "}
              {millify(Number(asset?.asset_pricing.amount!), {
                precision: 3,
              })}
            </h2>
            <InclusivePriceNote />
          </div>
          <div>
            {!isAssetAdded && (
              <Button
                type="button"
                className="text-sm font-semibold"
                disabled={isAddAssetsLoading}
                onClick={() => handleAddAssets(asset?.asset_pricing.id!)}
                data-testid="productcard-button"
              >
                Add
              </Button>
            )}
            {isAssetAdded && (
              <Button
                type="button"
                className="text-sm font-semibold pointer-events-none"
                disabled
                data-testid="productcard-button-2"
              >
                Added
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
