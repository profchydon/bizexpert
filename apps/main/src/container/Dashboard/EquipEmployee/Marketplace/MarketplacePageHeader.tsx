import PageHeader from "@/components/PageHeader";
import routes from "@/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const MarketplacePageHeader = () => {
  const router = useRouter();

  return (
    <div className="w-full page-px">
      <PageHeader
        breadCrumbs={[
          <Link key="overview" href={routes.EQUIP_EMPLOYEE}>
            Overview
          </Link>,
          "Marketplace",
        ]}
        pageTitle="Marketplace"
        pageDescription="Select items for this catalogs"
        onBack={() => router.back()}
      />
    </div>
  );
};

export default MarketplacePageHeader;
