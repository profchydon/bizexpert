"use client";
import { useMarketplaceProductDetails } from "./useMarketplaceProductDetails";
import Details from "./Details";
import PageState from "@/components/PageState";
import ProductDetailsPageHeader from "./ProductDetailsPageHeader";

const ProductDetails = () => {
  const { isLoading, isError, productTitle, detailsProps } =
    useMarketplaceProductDetails();

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="-page-mx flex min-h-screen flex-col bg-gray-25">
        <main className="flex flex-1 flex-col gap-8 pt-8 pb-12 sm:pt-12 sm:pb-24">
          <ProductDetailsPageHeader productTitle={productTitle} />

          <div className="page-px">
            <Details {...detailsProps} />
          </div>
        </main>
      </div>
    </PageState>
  );
};

export default ProductDetails;
