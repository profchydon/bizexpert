import React, { FC, useCallback, useMemo, useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { withListLocation } from "@/utils/tableListPage";
import { useDebounce } from "use-debounce";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";
import routes from "@/routes";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import OrderFilter from "@/components/Drawers/OrderFilter";
import OrdersTableRefresh from "@/container/Dashboard/Orders/OrdersTableRefresh";
import { useOrdersQuery } from "@/hooks/order/useOrders";
import { ordersColumnsV2 } from "./ordersColumnsV2";
import OrderRowActionsV2 from "./components/OrderRowActionsV2";

const OrdersTableV2: FC = () => {
  const { activeEntityId } = useActiveWorkspace();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 2000);

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

  const orderHref = useCallback(
    (orderId: string) =>
      withListLocation(
        appendEntityWorkspaceParam(
          `${routes.EQUIP_EMPLOYEE_ORDERS}/${orderId}`,
          activeEntityId,
        ),
        { page, query: filterQuery },
      ),
    [activeEntityId, filterQuery, page],
  );

  const columns = useMemo(
    () =>
      ordersColumnsV2({
        orderHref: (order) => orderHref(order.id),
        renderActions: (order) => (
          <OrderRowActionsV2
            order={order}
            viewHref={orderHref(order.id)}
            transactionViewHref={
              order.transaction_id
                ? routes.TRANSACTION_DETAIL(String(order.transaction_id))
                : undefined
            }
          />
        ),
      }),
    [orderHref],
  );

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          Orders
          {!isLoading && totalItems > 0 && (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
              {totalItems}
            </span>
          )}
        </h3>
        <div className="flex flex-row gap-x-2">
          <SearchWithIcon
            className="w-[310px]"
            placeholder="Search by Order ID/Serial Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <OrderFilter
            appliedFilters={filters}
            handleApply={handleApply}
            reset={reset}
          />
        </div>
      </div>
      <PageState isLoading={isLoading} isError={isError}>
        <OrdersTableRefresh isRefreshing={isRefreshing}>
          <DataTable
            data={orders}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
            pagination={{
              currentPage: page,
              lastPage,
              onPageChange: setPage,
            }}
          >
            <EmptyTableInstance
              title="No order yet"
              description="You have no order yet."
            />
          </DataTable>
        </OrdersTableRefresh>
      </PageState>
    </div>
  );
};

export default OrdersTableV2;
