import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CategorieChart from "./CategorieBreakdownChart";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetDashboardQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getDashboard";
import MobileCategorieBreakdownChart from "./MobileCategorieBreakdownChart";

const colors = ["#004CCC", "#E6EFFF", "#0C66FF", "#4388FF", "#79ABFF"];

const dummyData = [
  {
    fill: "#004CCC",
    category: "Laptop",
    count: 20,
  },
  {
    fill: "#0C66FF",
    category: "Computer",
    count: 9,
  },
];

const ItemsByType = () => {
  const companyId = useWorkspaceCompanyId();

  const { data: dashboadRes } = useGetDashboardQuery({
    companyId: companyId,
  });
  const category = dashboadRes?.data.equipment_by_category ?? [];

  const transformedData = () => {
    const updatedData = category.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }));
    return updatedData;
  };
  const chartData = transformedData();
  const dataToDisplay = chartData.length !== 0 ? chartData : dummyData;

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-gray-900 text-lg font-semibold">Items by type</h3>
        </div>

        <Separator />

        <div className="lg:block lg:place-content-start grid place-content-center">
          <div className="flex md:gap-x-5 items-start">
            <div className="md:block hidden relative">
              {chartData.length === 0 && (
                <>
                  <div className="absolute inset-0 w-full h-full backdrop-blur-sm z-[100]"></div>
                  <div className="absolute inset-0 w-full h-full grid place-content-center z-[101]">
                    <div className="font-medium text-sm text-white bg-gray-900 rounded-lg p-2 px-4">
                      No available data yet
                    </div>
                  </div>
                </>
              )}
              <CategorieChart chartData={dataToDisplay} />
            </div>
            <div className="md:hidden relative">
              {chartData.length === 0 && (
                <>
                  <div className="absolute inset-0 w-full h-full backdrop-blur-sm z-[100]"></div>
                  <div className="absolute inset-0 w-full h-full grid place-content-center z-[101]">
                    <div className="font-medium text-sm text-white bg-gray-900 rounded-lg p-2 px-4">
                      No available data yet
                    </div>
                  </div>
                </>
              )}
              <MobileCategorieBreakdownChart chartData={dataToDisplay} />
            </div>

            <div className="flex flex-col gap-y-2 pt-9">
              {dataToDisplay.map((data, index) => (
                <div
                  key={`${data.category}-${index}`}
                  className="flex gap-x-4 items-center"
                >
                  <div
                    className="rounded-full p-1"
                    style={{ backgroundColor: data.fill }}
                  ></div>
                  <span className="text-sm">{data.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemsByType;
