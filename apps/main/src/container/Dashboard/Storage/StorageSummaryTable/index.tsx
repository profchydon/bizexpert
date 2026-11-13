import React, { useMemo } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { withListLocation } from "@/utils/tableListPage";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Button } from "@/components/ui/button";
import StorageSummaryTableColumn from "./tableColumn";
import StorageSummaryActions from "./tableAction";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import { useGetInStorageEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipments";
import { IItemsInStorage, IItemsInStorageByCountry } from "@/types/equipments";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import {
  setCountry,
  setStorageToEmployeeItems,
} from "@/store/slices/equipEmployeeSlice";

interface Props {
  itemsInStorage: IItemsInStorageByCountry[];
}

const StorageSummaryTable: React.FC<Props> = ({ itemsInStorage }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { page, setPage } = useTablePageQuery();

  const columns: any = useMemo(
    () =>
      StorageSummaryTableColumn((item) => (
        <StorageSummaryActions
          viewHref={withListLocation(`${routes.STORAGE}/${item.country_id}`, {
            page,
          })}
          onBeforeNavigate={() => {
            dispatch(setSelectedEmployees([]));
            dispatch(setStorageToEmployeeItems([]));
            dispatch(setCountry({ id: item.country_id, name: item.country }));
          }}
        />
      )),
    [dispatch, page],
  );

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="p-4 border-b border-border-secondary flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-lg text-gray-900 font-semibold">
              Storage locations summary
            </h3>
            <span className="text-sm text-gray-600">
              This table shows the current storage locations and item counts for
              each region.
            </span>
          </div>
          {/* <div className="flex flex-col md:flex-row gap-2">
            <Link href={routes.OFFBOARDING}>
              <Button
                className="text-sm"
                variant={"primary"}
                data-testid="storagesummarytable-button"
              >
                Store equipment
              </Button>
            </Link>
          </div> */}
        </CardHeader>

        <PageState isLoading={false} isError={false}>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={itemsInStorage}
              columns={columns}
              // pagination={{
              //   currentPage,
              //   lastPage,
              //   onPageChange: (value) => setPage(value),
              // }}
            >
              <EmptyTableInstance description="" title="" />
            </DataTable>
          </CardContent>
        </PageState>
      </Card>
    </>
  );
};

export default StorageSummaryTable;
