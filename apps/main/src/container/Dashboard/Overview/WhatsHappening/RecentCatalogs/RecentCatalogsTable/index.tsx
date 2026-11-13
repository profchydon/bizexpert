import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import RecentCatalogTableColumn from "@/components/CatalogTable/RecentCatalogTableColumn";
import RecentCatalogTableActions from "@/components/CatalogTable/RecentCatalogTableActions";
import MobileRecentCatalogTableColumn from "@/components/CatalogTable/MobileRecentCatalogTableColumn";
import { ICatalog } from "@/types/catalog";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import routes from "@/routes";

interface Props {
  catalogs: ICatalog[];
}

const RecentCatalogsTable: React.FC<Props> = ({ catalogs }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const columns: any = useMemo(
    () =>
      RecentCatalogTableColumn((item) => (
        <RecentCatalogTableActions viewHref={`${routes.CATALOGS}/${item.id}`} />
      )),
    [],
  );
  const mobileColumns: any = useMemo(
    () =>
      MobileRecentCatalogTableColumn((item) => (
        <RecentCatalogTableActions viewHref={`${routes.CATALOGS}/${item.id}`} />
      )),
    [],
  );

  return (
    <div className="flex flex-col gap-y-5">
      <div className="hidden md:block">
        <DataTable data={catalogs} columns={columns}>
          <EmptyTableInstance
            title="No Catalog"
            description="This table will be updated once data is available."
          />
        </DataTable>
      </div>
      <div className="md:hidden">
        <DataTable data={catalogs} columns={mobileColumns}></DataTable>
      </div>
    </div>
  );
};

export default RecentCatalogsTable;
