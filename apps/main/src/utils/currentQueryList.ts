type PaginatedList<T> = {
  data?: {
    data?: T[] | null;
  } | null;
};

export const currentQueryList = <T>(
  currentData: PaginatedList<T> | null | undefined,
): T[] => currentData?.data?.data ?? [];
