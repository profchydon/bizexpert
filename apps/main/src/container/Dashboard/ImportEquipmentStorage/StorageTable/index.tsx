import React, { useMemo, useState, useEffect } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import StorageTableActions from "./tableAction";
import StorageTableColumn from "./tableColumn";
import { DataTable } from "@/components/ui/data-table";
import { IEquipment } from "@/types/equipments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StorageEmptyTable from "../StorageEmptyTable";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import PageState from "@/components/PageState";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useCallback } from "react";

const StorageTable = () => {
  // const router = useRouter();
  // const param = useSearchParams();
  const { page, setPage } = useTablePageQuery();

  const [items, setItems] = useState<IEquipment[]>([]);

  const handleDelete = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const companyId = useWorkspaceCompanyId();

  const [search, setSearch] = useState<string | null>(null);
  const [searchValue] = useDebounce(search, 2000);

  const {
    data: getEquipments,
    isLoading,
    isError,
  } = useGetEquipmentsQuery(
    {
      companyId: companyId!,
      params: {
        search: !searchValue ? null : searchValue,
        page,
      },
    },
    { skip: !companyId },
  );
  const equipmentsData = getEquipments?.data?.data;
  const currentPage = getEquipments?.data?.current_page ?? 1;
  const lastPage = getEquipments?.data?.last_page ?? 1;

  const columns = useMemo(
    () =>
      StorageTableColumn((item: Record<string, string>) => (
        <StorageTableActions onDelete={() => handleDelete(item.id)} />
      )),
    [handleDelete],
  );

  useEffect(() => {
    if (equipmentsData) {
      setItems(equipmentsData);
    }
  }, [equipmentsData]);

  return (
    <div>
      <PageState isLoading={isLoading} isError={isError}>
        <Card className="mt-6">
          <CardHeader className="p-4 border-b border-border-secondary flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg flex flex-row items-center font-semibold text-gray-900">
              Add Items
            </h3>
          </CardHeader>
          <CardContent className="px-0 pt-0 pb-2">
            <DataTable
              data={items}
              columns={columns}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: (value) => setPage(value),
              }}
            >
              <StorageEmptyTable />
            </DataTable>
          </CardContent>
        </Card>
      </PageState>
    </div>
  );
};

export default StorageTable;
