"use client";

import PageHeader from "@/components/PageHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AllEquipment from "./AllEquipmentsTable";
import { Button } from "@/components/ui/button";
import ActionsDrawer from "./AllEquipmentsTable/Actions";
import { useAppSelector } from "@/store";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import Link from "next/link";
import routes from "@/routes";

const ViewStorageCountry = () => {
  const param = useParams();
  const countryId = param.countryId as string;
  const searchParams = useSearchParams();
  const isDeviceRefreshInstance = searchParams.get("device-refresh");

  const router = useRouter();

  const storageToEmployeeItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );

  const renewStorageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.renewStorageItems,
  );

  const { data: countriesRes } = useGetCountriesQuery();
  const countryName = countriesRes?.data?.data?.find(
    (country: any) => country?.id === countryId,
  )?.name;

  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const storageItems = Array.isArray(storageToEmployeeItems)
    ? storageToEmployeeItems
    : [];
  const renewItems = Array.isArray(renewStorageItems) ? renewStorageItems : [];

  const allValid = storageItems.length > 0 || renewItems.length > 0;
  const totalCount = storageItems.length + renewItems.length;

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={[
          <Link href={routes.STORAGE}>Storage</Link>,
          <span className="text-primary-600">Equipment</span>,
        ]}
        pageTitle={`Storage${countryName ? ` - ${countryName}` : ""}`}
        pageDescription="Easily store, manage, and track your company's equipment."
        onBack={() => router.back()}
      >
        <>
          {!Boolean(isDeviceRefreshInstance) && (
            <Button
              className="text-sm space-x-2"
              disabled={!allValid}
              onClick={() => {
                if (allValid) {
                  setIsActionsOpen(true);
                }
              }}
              data-testid="viewstoragecountry-button"
            >
              <span className="bg-white py-[2px] px-2 text-primary-700 font-medium text-xs rounded-full">
                {totalCount}
              </span>
              <span className="font-semibold">View actions</span>
            </Button>
          )}
        </>
      </PageHeader>
      <div className="mt-8 space-y-6">
        <AllEquipment />
      </div>

      <ActionsDrawer
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
      />
    </div>
  );
};

export default ViewStorageCountry;
