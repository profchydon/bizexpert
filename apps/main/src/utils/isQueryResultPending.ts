type QueryPendingState = {
  isUninitialized?: boolean;
  isLoading: boolean;
  isFetching: boolean;
  hasRows: boolean;
};

export const isQueryResultPending = ({
  isUninitialized,
  isLoading,
  isFetching,
  hasRows,
}: QueryPendingState): boolean =>
  Boolean(isUninitialized) || isLoading || (isFetching && !hasRows);
