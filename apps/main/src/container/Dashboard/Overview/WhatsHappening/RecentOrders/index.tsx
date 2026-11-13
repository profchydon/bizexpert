"use client";

import { TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import routes from "@/routes";
import { isDashboardRecentOrdersVisible } from "../../dashboardRecentOrders";
import RecentOrdersTable from "./RecentOrdersTable";

const RecentOrders = () => {
  const { data } = useWorkspaceDashboardQuery();

  if (!isDashboardRecentOrdersVisible(data?.data)) {
    return null;
  }

  return (
    <TableCard.Root className="h-full">
      <TableCard.Header
        title="Recent orders"
        description="Review the latest orders placed"
        contentTrailing={
          <Button
            color="secondary"
            size="sm"
            href={routes.ORDERS}
            className="shrink-0"
            data-testid="recentorders-button"
          >
            View orders
          </Button>
        }
      />
      <RecentOrdersTable />
    </TableCard.Root>
  );
};

export default RecentOrders;
