"use client";
import PageHeader from "@/components/PageHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Details from "./Details";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetAssetQuery } from "@/api/baseQueries/assetsApi/getAsset";
import PageState from "@/components/PageState";
import Link from "next/link";
import routes from "@/routes";
import useCart from "@/hooks/useCart";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";

const ProductDetails = () => {
  const param = useParams();
  const router = useRouter();

  const queryParam = useSearchParams();
  const specId = queryParam.get("specId");
  const assetId = param.id as string;

  const catalogId = queryParam.get("catalogId") as string;

  const companyId = useWorkspaceCompanyId();
  const scopedCompanyId = companyId;

  const { data: catalogRes } = useGetCatalogQuery(
    {
      catalogId,
      companyId: scopedCompanyId!,
    },
    { skip: !catalogId || !scopedCompanyId },
  );
  const catalog = catalogRes?.data;

  const {
    data: assetDetailRes,
    isLoading,
    isError,
  } = useGetAssetQuery(
    {
      companyId: scopedCompanyId!,
      country_id: catalog?.country?.id!,
      assetId,
    },
    { skip: !assetId || !catalog || !scopedCompanyId },
  );
  const assetDetail = assetDetailRes?.data;

  const getCurrentAssetSpec = assetDetail?.specifications?.find(
    (spec) => spec?.id === specId,
  );
  const assetSpecs = getCurrentAssetSpec?.spec
    .map((spec) => spec.value)
    .join(" ");

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            "Catalog",
            <Link
              href={{
                pathname: routes.CATALOGS_MARKETPLACE,
                query: { catalogId },
              }}
            >
              Marketplace
            </Link>,
            <span className="text-primary-600">
              {assetDetail?.name} {assetSpecs}
            </span>,
          ]}
          pageTitle="Marketplace"
          pageDescription="Select items for this catalog"
          onBack={() => router.back()}
        />

        <Details
          assetDetail={assetDetail!}
          assetSpecs={assetSpecs!}
          specId={specId!}
          catalog={catalog}
        />
      </div>
    </PageState>
  );
};

export default ProductDetails;
