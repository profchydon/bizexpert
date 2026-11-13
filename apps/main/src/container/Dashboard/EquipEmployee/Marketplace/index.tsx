"use client";
import React from "react";
import ProductsLayout from "./ProductsLayout";
import MarketplacePageHeader from "./MarketplacePageHeader";

const MarketplaceContianer = () => {
  return (
    <div className="-page-mx flex min-h-screen flex-col bg-gray-25">
      <main className="flex flex-1 flex-col gap-6 pt-8 pb-12 sm:gap-8 sm:pt-12 sm:pb-24">
        <MarketplacePageHeader />
        <ProductsLayout />
      </main>
    </div>
  );
};

export default MarketplaceContianer;
