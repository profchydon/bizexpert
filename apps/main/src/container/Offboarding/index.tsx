"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Offboard_asset } from "@/types/offboarding";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeItemsNotCompleted } from "@/components/Offboarding/util";
import { resetOffboardingData } from "@/store/slices/offboardingSlice";
import AllEquipmentsTable from "@/components/AllEquipments/AllEquipmentsTable";
import routes from "@/routes";

const Offboarding = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const toggleActionDrawer = () => setIsActionDrawerOpen(!isActionDrawerOpen);

  const { country } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const countryId = country?.id;
  const countryName = country?.name;

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  useEffect(() => {
    removeItemsNotCompleted(offboardingData, dispatch);
  }, []);

  useEffect(() => {
    dispatch(resetOffboardingData());
  }, []);

  const actionsDB = useMemo(() => {
    if (!offboardingData) {
      return [];
    }
    if (Array.isArray(offboardingData)) {
      return offboardingData;
    }
    return [offboardingData];
  }, [offboardingData]) as Offboard_asset[];

  return (
    // <div className="relative h-screen w-full">
    //   <iframe
    //     aria-label="Asset Offboarding Form"
    //     frameBorder="0"
    //     allow="geolocation;"
    //     style={{ height: "100vh", width: "99%", border: "none" }}
    //     src="https://forms.zohopublic.com/myrayda/form/AssetOffboardingForm/formperma/wmOk8RezDxkQmk7xbMuZIi3zVt_PWQqlLJ5FieneZMA"
    //   ></iframe>
    // </div>
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={[
            <Link href={""}>Off board device</Link>,
            <span className="text-primary-600">Off-board equipment</span>,
          ]}
          pageTitle={`Off-board equipment in ${countryName ? ` - ${countryName}` : ""}`}
          pageDescription="Choose the equipment you want to off-board, transfer, store, or sell here."
          onBack={() => router.back()}
        >
          <Button
            className="text-sm space-x-2"
            disabled={actionsDB?.length < 1}
            onClick={toggleActionDrawer}
            data-testid="offboarding-button"
          >
            <span className="bg-white py-[2px] px-2 text-primary-700 font-medium text-xs rounded-full">
              {actionsDB?.length}
            </span>
            <span className="font-semibold">View actions</span>
          </Button>
        </PageHeader>

        <div className="mt-8 flex flex-col">
          <AllEquipmentsTable
            baseRoute={routes.OFFBOARDING}
            isActionDrawerOpen={isActionDrawerOpen}
            setIsActionDrawerOpen={setIsActionDrawerOpen}
            getAssignedEquipments
            removeFilterButton
            assigned_country={countryId}
            country_name={countryName}
          />
        </div>
      </div>
    </div>
  );
};

export default Offboarding;
