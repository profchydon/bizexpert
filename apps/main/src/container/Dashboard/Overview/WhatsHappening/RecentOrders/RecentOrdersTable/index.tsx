import React from "react";
import { DataTable } from "@/components/ui/data-table";
import routes from "@/routes";
import PageState from "@/components/PageState";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import OrderTableActions from "@/components/OrderTable/OrderTableActions";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import DashboardOrdersTableColumn from "@/components/OrderTable/DashboardOrdersTableColumn";
import MobileDashboardOrdersTableColumn from "@/components/OrderTable/MobileDashboardOrdersTableColumn";
import { dashboardRecentOrders } from "@/container/Dashboard/Overview/dashboardRecentOrders";
import { overviewResponsiveTableClass } from "@/container/Dashboard/Overview/overviewDashboardLayout";
import {
  overviewDataTableProps,
  overviewMobileDataTableProps,
} from "@/container/Dashboard/Overview/overviewTableClasses";
import type { IRecentOrders } from "@/types/dashboard";
import type { IOrder } from "@/types/orders";

const RecentOrdersTable: React.FC = () => {
  const { data, isError, isLoading, isFetching } = useWorkspaceDashboardQuery();
  const isOrderLoading = isLoading || isFetching;
  const orders = dashboardRecentOrders(data?.data);

  const renderAction = (item: IRecentOrders) => (
    <OrderTableActions
      item={item as IOrder}
      viewHref={`${routes.ORDERS}/${item.id}`}
    />
  );

  const columns = React.useMemo(
    () => [...DashboardOrdersTableColumn(renderAction)],
    [],
  );

  const mobileColumns = React.useMemo(
    () => [...MobileDashboardOrdersTableColumn(renderAction)],
    [],
  );

  return (
    <PageState isError={isError} isLoading={isOrderLoading}>
      <div className="flex flex-col gap-y-5 px-4 pb-5 sm:px-6">
        <div className={overviewResponsiveTableClass.desktop}>
          <DataTable
            data={orders}
            columns={columns}
            {...overviewDataTableProps}
          >
            <EmptyTableInstance
              title="Recent orders yet"
              description="This table will be updated once data is available."
            />
          </DataTable>
        </div>
        <div className={overviewResponsiveTableClass.mobile}>
          <DataTable
            data={orders}
            columns={mobileColumns}
            {...overviewMobileDataTableProps}
          >
            <EmptyTableInstance
              title="Recent orders yet"
              description="This table will be updated once data is available."
            />
          </DataTable>
        </div>
      </div>
    </PageState>
  );
};

export default RecentOrdersTable;
