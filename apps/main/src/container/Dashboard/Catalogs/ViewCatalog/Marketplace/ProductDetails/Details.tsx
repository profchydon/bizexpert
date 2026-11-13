import { Button } from "@/components/ui/button";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { FC, useState } from "react";
import { product_1 } from "@/assets/images";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import routes from "@/routes";
import formatAmount from "@/utils/formatAmount";
import { IAsset } from "@/types/assets";
import { cn } from "@/lib/utils";
import createQueryString from "@/utils/createQueryString";
import { ChevronRight } from "lucide-react";
import DetailDescription from "./DetailDescription";
import { Checkbox } from "@/components/ui/checkbox";
import ThumnailSlider from "@/components/ThumnailSlider";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useAddAssetsToCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/addAssetsToCatalog";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useRemoveAssetsToCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/removeAssetsToCatalog";
import useCatalog from "@/hooks/useCatalog";
import { ICatalog } from "@/types/catalog";

interface Props {
  assetDetail: IAsset;
  assetSpecs: string;
  specId?: string;
  catalog?: ICatalog;
}

const Details: React.FC<Props> = ({
  assetDetail,
  assetSpecs,
  specId,
  catalog,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const catalogAssets =
    catalog?.assets?.data?.map((asset) => asset.asset_pricing.id) ?? [];

  const {
    handleRemoveAsset,
    isRemoveAssetLoading,
    handleAddAssets,
    isAddAssetsLoading,
  } = useCatalog(catalog!);

  const currentSpec = assetDetail?.specifications?.find(
    (spec) => spec?.id === specId,
  );

  const isAssetAdded = catalogAssets.includes(currentSpec?.asset_pricing?.id!);

  const currentPrice = currentSpec?.asset_pricing;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const toggleDescriptionModal = () => setIsDescriptionOpen(!isDescriptionOpen);

  return (
    <div className="flex flex-col mt-10 lg:flex-row gap-8 md:items-center">
      <section className="w-full lg:w-[488px] h-auto rounded-[24px] flex flex-col">
        {assetDetail?.images?.length < 1 ? (
          <div className="w-full lg:w-[281px] h-auto  bg-[#f2f4f7] p-4 rounded-md">
            <Image
              src={product_1 || ""}
              alt="details_image"
              width={281}
              height={259.12}
              className="w-full object-fill"
            />
          </div>
        ) : (
          <div className="w-full lg:w-[488px] h-auto">
            <ThumnailSlider images={assetDetail?.images || []} />
          </div>
        )}
      </section>

      <section className="w-full lg:mt-0 lg:flex-1">
        <div>
          <h1 className="font-medium text-xl text-gray-900 leading-[1.875rem]">
            {assetDetail?.name} {assetDetail?.make} {assetDetail?.model}{" "}
            {assetSpecs}
          </h1>
          <div className="flex gap-x-5 items-center mt-4">
            <div className="flex flex-col">
              <h1 className="font-semibold text-5xl leading-[3.75rem] tracking-[-0.02em] text-gray-900">
                {currentPrice?.currency?.symbol}
                {formatAmount(currentPrice?.amount!)}
              </h1>
              <InclusivePriceNote />
            </div>
            {!isAssetAdded && (
              <Button
                type="button"
                className="text-sm font-semibold"
                disabled={isAddAssetsLoading}
                onClick={() => handleAddAssets(currentSpec?.asset_pricing?.id!)}
                data-testid="details-button"
              >
                Add
              </Button>
            )}
            {isAssetAdded && (
              <Button
                type="button"
                variant={"ghost"}
                disabled={isRemoveAssetLoading}
                className="text-primary-600 bg-primary-50 text-sm font-semibold"
                onClick={() =>
                  handleRemoveAsset(currentSpec?.asset_pricing?.id!)
                }
                data-testid="details-button-2"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <Separator className="mt-6" />
        <p className="my-8 font-normal text-sm text-gray-700 opacity-70">
          {assetDetail?.description}
        </p>

        <Separator className="mt-[1.0625rem]" />

        <div
          className="my-3 text-gray-600 items-center flex justify-between cursor-pointer !leading-6"
          onClick={toggleDescriptionModal}
        >
          <span className="text-sm font-semibold">Description</span>

          <span>
            <ChevronRight className="w-4" />
          </span>
        </div>

        <Separator className="" />

        <div className="mt-6 flex flex-col gap-y-5">
          <div>
            <h3 className="font-semibold text-base text-gray-900 mb-3">
              Other Specifications
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {assetDetail?.specifications?.map((spec) => {
                const getSpecProps = spec?.spec
                  .map((prop) => prop.value)
                  .join(" ");
                return (
                  <div
                    key={spec?.id}
                    className={cn(
                      "cursor-pointer border-[0.5px] border-[##D0D5DD]  rounded-lg p-4",
                      spec?.id === specId &&
                        "border border-primary-200 shadow-xs focused",
                    )}
                    onClick={() =>
                      router.push(
                        `${pathname}?${createQueryString("specId", spec?.id!)}`,
                        { scroll: false },
                      )
                    }
                  >
                    <div>
                      <div className="text-gray-900 flex gap-x-4 text-xs mb-5">
                        <div
                          className="line-clamp-2"
                          title={`${assetDetail.name} ${getSpecProps}`}
                        >
                          {assetDetail.name} {getSpecProps}
                        </div>

                        <Checkbox
                          checked={spec?.id === specId}
                          data-testid="details-checkbox"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs flex-col space-y-3">
                        {spec?.spec?.map((prop) => (
                          <div className="flex justify-between" key={prop.name}>
                            <span className="font-semibold text-gray-900">
                              {prop.name}:
                            </span>
                            <span className="capitalize">{prop.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <DetailDescription
        isOpen={isDescriptionOpen}
        onClose={toggleDescriptionModal}
        asset={assetDetail}
        spec={currentSpec?.spec!}
      />
    </div>
  );
};

export default Details;
