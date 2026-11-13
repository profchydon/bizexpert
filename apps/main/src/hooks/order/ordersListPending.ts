type OrdersQueryFlags = {
  isUninitialized?: boolean;
  isLoading: boolean;
  isFetching: boolean;
  hasCurrentResults: boolean;
};

export const isOrdersListAwaitingResults = ({
  isUninitialized,
  isLoading,
  isFetching,
  hasCurrentResults,
}: OrdersQueryFlags) =>
  Boolean(isUninitialized) || isLoading || (isFetching && !hasCurrentResults);

export const isOrdersListRefreshing = ({
  isFetching,
  hasCurrentResults,
}: Pick<OrdersQueryFlags, "isFetching" | "hasCurrentResults">) =>
  isFetching && hasCurrentResults;
