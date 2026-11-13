export const hasDifferentCountriesForTransfer = (assets: any[]): boolean => {
  return assets.some(
    (asset) =>
      asset?.actionType === "Transfer" &&
      asset?.assignee?.country &&
      asset?.receiver?.country &&
      asset?.assignee?.country !== asset?.receiver?.country,
  );
};
