export function isOrderUpdatesInitialLoading({
  canLoad,
  isError,
  activityCount,
  currentPage,
}: {
  canLoad: boolean;
  isError: boolean;
  activityCount: number;
  currentPage: number;
}): boolean {
  return canLoad && !isError && activityCount === 0 && currentPage === 0;
}
