import React, { FC, useMemo, useState, useCallback } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { withListLocation } from "@/utils/tableListPage";

import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import PageState from "@/components/PageState";
import OrdersTableColumn from "@/components/OrderTable/OrdersTableColumn";
import OrderTableActions from "@/components/OrderTable/OrderTableActions";
import { ListOrderCancelHost } from "@/container/Dashboard/Orders/ListOrderCancelHost";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useOrdersQuery } from "@/hooks/order/useOrders";
import OrderFilter from "@/components/Drawers/OrderFilter";
import OrdersTableRefresh from "@/container/Dashboard/Orders/OrdersTableRefresh";
import { IOrder } from "@/types/orders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const OrdersTable: FC = () => {
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 2000);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const handleCancelOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const {
    data: ordersRes,
    isError,
    isLoading,
    isRefreshing,
    page,
    setPage,
    filters,
    filterQuery,
    handleApply,
    reset,
  } = useOrdersQuery({ search: debouncedSearch || null });

  useResetTablePage(setPage, debouncedSearch);

  const orders = useMemo(
    () => (ordersRes as any)?.data?.data ?? [],
    [ordersRes],
  );
  const lastPage = useMemo(
    () => (ordersRes as any)?.data?.last_page || 1,
    [ordersRes],
  );
  const totalItems = useMemo(
    () => (ordersRes as any)?.data?.total || 0,
    [ordersRes],
  );

  const isOrderLoading = isLoading;

  const orderHref = useCallback(
    (orderId: string) =>
      withListLocation(`${routes.EQUIP_EMPLOYEE_ORDERS}/${orderId}`, {
        page,
        query: filterQuery,
      }),
    [filterQuery, page],
  );

  const handleViewOrder = useCallback(
    (orderId: string) => {
      router.push(orderHref(orderId));
    },
    [orderHref, router],
  );

  const handleSetSignatureRequired = useCallback(
    (order: IOrder, params: { setToTrue: boolean }) => {
      router.push(
        `${routes.EQUIP_EMPLOYEE_ORDERS}/${order.id}?signature_requested=${params.setToTrue}`,
      );
    },
    [router],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
    },
    [setPage],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  const columns = useMemo(
    () =>
      OrdersTableColumn(
        (item) => (
          <OrderTableActions
            item={item}
            viewHref={orderHref(item.id)}
            onSetSignatureRequired={(params) =>
              handleSetSignatureRequired(item, params)
            }
          />
        ),
        false,
        false,
        handleViewOrder,
      ),
    [handleSetSignatureRequired, handleViewOrder, orderHref],
  );

  return (
    <>
      <Card className="mt-2">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between px-6">
          <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
            Orders
            {!isOrderLoading && totalItems > 0 && (
              <Badge className="bg-primary-25 text-primary-700 hover:bg-primary-25">
                {totalItems}
              </Badge>
            )}
          </h3>
          <div className="flex flex-row gap-x-2">
            <SearchWithIcon
              className="w-[310px]"
              placeholder="Search by Order ID/Serial Number"
              value={search}
              onChange={handleSearchChange}
            />
            <OrderFilter
              appliedFilters={filters}
              handleApply={handleApply}
              reset={reset}
            />
          </div>
        </CardHeader>
        <PageState isLoading={isOrderLoading} isError={isError}>
          <OrdersTableRefresh isRefreshing={isRefreshing}>
            <CardContent className="px-0 pt-0 pb-2">
              <DataTable
                data={orders}
                columns={[...columns]}
                pagination={{
                  currentPage: page,
                  lastPage,
                  onPageChange: handlePageChange,
                }}
              >
                <EmptyTableInstance
                  title="No order yet"
                  description="You have no order yet."
                />
              </DataTable>
            </CardContent>
          </OrdersTableRefresh>
        </PageState>
      </Card>

      <ListOrderCancelHost
        isOpen={cancelModalOpen}
        order={selectedOrder}
        companyId={companyId}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
};

export default OrdersTable;
