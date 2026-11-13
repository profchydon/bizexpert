"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import CustomMap from "@/components/CustomMap";
import CountryDetail from "./CountryDetail";
import millify from "millify";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { mapCountriesToCoordinates } from "@/utils/mapCountriesToCoordinates";

const EquipmentsByCountry = () => {
  const [countries, setCountries] = useState<
    {
      lat: number;
      lng: number;
      address: string;
    }[]
  >([]);
  const { data: dashboadRes } = useWorkspaceDashboardQuery();
  const equipmentByCountry = dashboadRes?.data.equipment_by_country!;

  useEffect(() => {
    if (!equipmentByCountry?.length) {
      setCountries([]);
      return;
    }

    setCountries(mapCountriesToCoordinates(equipmentByCountry));
  }, [equipmentByCountry]);

  const totalCount = equipmentByCountry?.reduce(
    (total, item) => total + item?.count,
    0,
  );

  const dataWithPercentage = equipmentByCountry.map((item) => {
    const percentage = ((item.count / totalCount) * 100).toFixed(2);
    return { ...item, percentage: percentage };
  });

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-gray-900 text-lg font-semibold">
            Equipment by country
          </h3>
          <span className="text-gray-600 text-sm">
            View equipment by Country
          </span>
        </div>

        <Separator />

        <div className="grid grid-cols-[1fr,auto] gap-x-4">
          <div className="hidden relative md:block">
            {equipmentByCountry.length === 0 && (
              <>
                <div className="absolute inset-0 w-full h-full backdrop-blur-sm z-[100]"></div>
                <div className="absolute inset-0 w-full h-full grid place-content-center z-[101]">
                  <div className="font-medium text-sm text-white bg-gray-900 rounded-lg p-2 px-4">
                    No available data yet
                  </div>
                </div>
              </>
            )}
            <CustomMap mapData={countries} />
          </div>
          <div className="bg-white h-full">
            <div className="space-y-5 px-4">
              <div className="font-black text-4xl text-gray-900">
                {millify(dashboadRes?.data.cards.total_order_value!, {
                  precision: 2,
                })}
              </div>

              <div className="flex flex-col gap-y-4">
                {dataWithPercentage.slice(0, 5).map((country) => {
                  return (
                    <div key={country.country}>
                      <CountryDetail
                        percentage={country.percentage}
                        counts={country.count}
                        name={country.country}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentsByCountry;
