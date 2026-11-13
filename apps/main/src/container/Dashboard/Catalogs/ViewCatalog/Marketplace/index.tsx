"use client";
import PageHeader from "@/components/PageHeader";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import ProductsLayout from "./ProductsLayout";
import Link from "next/link";
import routes from "@/routes";

const CatalogMarketplace = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={routes.CATALOGS}>Catalogs</Link>,
            "Marketplace",
          ]}
          pageTitle="Marketplace"
          pageDescription="Select items for this catalog"
          onBack={() => router.back()}
        />

        <ProductsLayout />
      </div>
    </div>
  );
};

export default CatalogMarketplace;
