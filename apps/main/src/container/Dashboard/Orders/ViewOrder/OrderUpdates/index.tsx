import React, { useMemo } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { IOrder } from "@/types/orders";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useGetOrderActivitiesQuery } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";
import { useOrderScopedCompanyId } from "@/hooks/useOrderScopedCompanyId";
import PageState from "@/components/PageState";
import {
  collapseDuplicateCancelledActivities,
  isStaleCancelledOrderActivity,
  mapActivityToFeedItem,
} from "./mapOrderActivity";
import { OrderUpdatesCard } from "./OrderUpdatesCard";
import { parseOrderActivitiesResponse } from "./parseOrderActivitiesResponse";

interface Props {
  order: IOrder;
}

const UPDATES_PER_PAGE = 10;

const OrderUpdates: React.FC<Props> = ({ order }) => {
  const companyId = useOrderScopedCompanyId(order);
  const { page, setPage } = useTablePageQuery("updates_page");
  useResetTablePage(setPage, companyId, order?.id);

  const { data, isLoading, isFetching, isError } = useGetOrderActivitiesQuery(
    {
      companyId,
      orderId: order?.id,
      params: {
        per_page: UPDATES_PER_PAGE,
        page,
      },
    },
    { skip: !companyId || !order?.id },
  );

  const { activities, currentPage, lastPage } = useMemo(
    () => parseOrderActivitiesResponse(data, page),
    [data, page],
  );

  const visibleActivities = collapseDuplicateCancelledActivities(
    activities.filter(
      (item) => !isStaleCancelledOrderActivity(item, order.status),
    ),
  );

  const feedItems = visibleActivities.map((item, index) =>
    mapActivityToFeedItem(item, index, visibleActivities.length),
  );

  const isInitialLoading = isLoading && activities.length === 0;
  const isPageLoading = isFetching && !isInitialLoading;

  return (
    <PageState isError={isError} isLoading={isInitialLoading}>
      <div>
        {activities.length === 0 && !isFetching ? (
          <EmptyTableInstance
            title="No order updates yet"
            description="Order updates and cancellation requests will appear here."
          />
        ) : (
          <OrderUpdatesCard
            items={feedItems}
            currentPage={currentPage}
            totalPages={lastPage}
            onPageChange={setPage}
            isPageLoading={isPageLoading}
          />
        )}
      </div>
    </PageState>
  );
};

export default OrderUpdates;
