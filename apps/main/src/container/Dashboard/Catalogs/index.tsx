"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ListFilter, ChevronDown } from "lucide-react";
import { laptop02, bank_note } from "@/assets/icons";
import CatalogLayout from "./CatalogLayout";
import FilterCatalogs from "./FilterCatalogs";
import CreateCatalog from "./CreateCatalogs";
import routes from "@/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CatalogType = "device" | "budget";

const Catalogs = () => {
  const params = useSearchParams();
  const actionType = params.get("action");
  const router = useRouter();

  const [isFilterCatalogsOpen, setIsFilterCatalogsOpen] = useState(false);
  const toggleFilterCatalogs = () =>
    setIsFilterCatalogsOpen(!isFilterCatalogsOpen);

  const [isCreateCatalogOpen, setIsCreateCatalogOpen] = useState(false);
  const [createCatalogType, setCreateCatalogType] =
    useState<CatalogType>("device");
  const [activeCatalogTab, setActiveCatalogTab] =
    useState<CatalogType>("device");

  const handleCreateCatalog = (type: CatalogType) => {
    setCreateCatalogType(type);
    setActiveCatalogTab(type);
    setIsCreateCatalogOpen(true);
  };

  useEffect(() => {
    if (actionType && actionType === "create") {
      setIsCreateCatalogOpen(true);
    }
  }, [actionType]);

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Catalogs"]}
        pageTitle="Catalogs"
        pageDescription="Easily provide your employee's with the necessary resources to start their journey in your company."
        onBack={() => router.back()}
      >
        <div className="md:self-end flex gap-3">
          {/* <Button
              variant="outline"
              onClick={toggleFilterCatalogs}
              data-testid="catalogs-filter-button"
              className="flex items-center gap-2"
            >
              <ListFilter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filter</span>
            </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="catalogs-button">
                <span className="text-sm font-semibold">Create catalog</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleCreateCatalog("device")}
              >
                <Image src={laptop02} alt="device" width={16} height={16} />
                <span className="font-medium">Device Catalog</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleCreateCatalog("budget")}
              >
                <Image src={bank_note} alt="budget" width={16} height={16} />
                <span className="font-medium">Budget Catalog</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageHeader>

      <div className="mt-6">
        <Tabs
          value={activeCatalogTab}
          onValueChange={(value) => setActiveCatalogTab(value as CatalogType)}
        >
          <TabsList className="bg-gray-50 rounded-lg p-1 h-auto w-fit gap-0 border border-gray-200">
            <TabsTrigger
              value="device"
              className="rounded-md px-6 py-2.5 text-sm font-semibold text-gray-500 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-none border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0"
            >
              Device Catalog
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="rounded-md px-6 py-2.5 text-sm font-semibold text-gray-500 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-none border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0"
            >
              Budget Catalog
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        <CatalogLayout catalogType={activeCatalogTab} />
      </div>

      <FilterCatalogs
        isOpen={isFilterCatalogsOpen}
        onClose={toggleFilterCatalogs}
        onSave={() => null}
      />

      <CreateCatalog
        isOpen={isCreateCatalogOpen}
        catalogType={createCatalogType}
        onClose={() => {
          router.push(routes.CATALOGS);
          setIsCreateCatalogOpen(false);
        }}
      />
    </div>
  );
};

export default Catalogs;
