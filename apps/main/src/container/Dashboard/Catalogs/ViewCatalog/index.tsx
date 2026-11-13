"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import CatalogLeftSection from "./CatalogLeftSection";
import { Card, CardContent } from "@/components/ui/card";
import CatalogTable from "./CatalogTable";
import ShareCatalogDrawer from "./ShareCatalogDrawer";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import ConfigureCatalog from "./ConfigureCatalog";
import ItemQuantityConfig from "./ConfigureCatalog/ItemQuantityConfig";
import CreateCatalog from "../CreateCatalogs";
import { ICatalog } from "@/types/catalog";
import Link from "next/link";
import routes from "@/routes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const ViewCatalog = () => {
  const param = useParams();
  const catalogId = param.id as string;
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const {
    data: catalogRes,
    isLoading,
    isError,
  } = useGetCatalogQuery(
    {
      catalogId,
      companyId: companyId!,
    },
    { skip: !catalogId },
  );
  const catalog = catalogRes?.data;

  const [configureCatalog, setConfigureCatalog] = useState<ICatalog>();
  const [itemConfig, setItemConfig] = useState<ICatalog>();

  const [isEditCatalogOpen, setIsEditCatalogOpen] = useState(false);

  const [shareCatalog, setShareCatalog] = useState<ICatalog>();

  const router = useRouter();

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={routes.CATALOGS}>Catalogs</Link>,
            <span className="text-primary-700">{catalog?.name}</span>,
          ]}
          pageTitle={catalog?.name!}
          pageDescription={catalog?.description}
          onBack={() => router.back()}
        >
          <div className="md:self-end flex gap-3">
            <Button
              variant="outline"
              className="text-sm border-0 font-semibold text-primary-700 bg-primary-50"
              onClick={() => setConfigureCatalog(catalog)}
              data-testid="viewcatalog-button"
            >
              Configure Catalog
            </Button>

            <Button
              variant="outline"
              className="text-sm font-semibold text-gray-700"
              onClick={() => setIsEditCatalogOpen(true)}
              data-testid="viewcatalog-button-2"
            >
              Edit Catalog
            </Button>

            <Button
              className="text-sm"
              disabled={false}
              onClick={() => setShareCatalog(catalog)}
              data-testid="viewcatalog-button-3"
            >
              <span className="text-sm font-semibold text-white">Share</span>
            </Button>
          </div>
        </PageHeader>

        <div className="lg:grid lg:grid-cols-[25%,1fr] flex flex-col gap-6 mt-8">
          <Card className="py-6 pb-0">
            <CardContent>
              <CatalogLeftSection catalog={catalog} />
            </CardContent>
          </Card>

          <CatalogTable catalog={catalog} />
        </div>

        <ConfigureCatalog
          isOpen={Boolean(configureCatalog)}
          catalog={configureCatalog}
          onOpenQtyConfig={() => setItemConfig(catalog)}
          onClose={() => {
            setConfigureCatalog(undefined);
            setItemConfig(undefined);
          }}
        />

        <ItemQuantityConfig
          isOpen={Boolean(itemConfig)}
          onClose={() => {
            setItemConfig(undefined);
          }}
          catalog={itemConfig}
        />

        <CreateCatalog
          isOpen={isEditCatalogOpen}
          editCatalogData={catalog}
          onClose={() => {
            setIsEditCatalogOpen(false);
          }}
        />

        <ShareCatalogDrawer
          isOpen={Boolean(shareCatalog)}
          onClose={() => setShareCatalog(undefined)}
          catalog={shareCatalog}
        />
      </div>
    </PageState>
  );
};

export default ViewCatalog;
