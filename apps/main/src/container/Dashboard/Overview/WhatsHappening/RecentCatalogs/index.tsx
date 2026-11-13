import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
// import { ListFilter } from "lucide-react";
import RecentCatalogsTable from "./RecentCatalogsTable";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { ICatalog } from "@/types/catalog";

const RecentCatalogs = () => {
  const { data: dashboardRes } = useWorkspaceDashboardQuery();

  const catalogs = dashboardRes?.data.recent_catalogs;

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-y-5">
        <div className="flex sm:flex-row flex-col gap-y-3 sm:gap-y-0 sm:justify-between sm:items-center">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-gray-900 text-lg font-semibold">
              Recent catalogs
            </h3>
            <span className="text-gray-600 text-sm">
              Browse and manage the catalogs currently available
            </span>
          </div>

          <div className="flex items-center gap-x-3">
            <Button
              variant={"outline"}
              className="text-sm font-semibold"
              data-testid="recentcatalogs-button"
            >
              View catalogs
            </Button>
            {/* <Button
              variant={"outline"}
              className="text-sm md:block hidden font-semibold"
            >
              <ListFilter className="w-5 mr-2" /> Filters
            </Button> */}
          </div>
        </div>

        <Separator />

        <RecentCatalogsTable catalogs={catalogs as ICatalog[]} />
      </CardContent>
    </Card>
  );
};

export default RecentCatalogs;
