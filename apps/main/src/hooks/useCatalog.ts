import { useAddAssetsToCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/addAssetsToCatalog";
import { useRemoveAssetsToCatalogMutation } from "@/api/baseQueries/companiesApi/catalogsApi/removeAssetsToCatalog";
import { IAsset } from "@/types/assets";
import { ICatalog } from "@/types/catalog";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import formatAmount from "@/utils/formatAmount";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const useCatalog = (catalog: ICatalog) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const companyId = useWorkspaceCompanyId();
  const catalogAssets = catalog?.assets?.data ?? [];

  let lowerBoundaryTotal = 0;
  let upperBoundaryTotal = 0;
  let totalAssetAmountRange;

  if (catalogAssets && catalogAssets.length > 0) {
    const groupedByCategory: { [key: string]: number[] } = catalogAssets.reduce(
      (acc, item) => {
        const category = item.category;
        const amount = Number(item.asset_pricing.amount);

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(amount);

        return acc;
      },
      {} as { [key: string]: number[] },
    );

    for (const amounts of Object.values(groupedByCategory)) {
      lowerBoundaryTotal += Math.min(...amounts);
      upperBoundaryTotal += Math.max(...amounts);
    }

    totalAssetAmountRange = ` 
              ${billingSymbol}${formatAmount(String(lowerBoundaryTotal))} - 
              ${billingSymbol}${formatAmount(String(upperBoundaryTotal))}
            `;
  } else {
    totalAssetAmountRange = undefined;
  }

  const [removeAssetFromCatalog, removeAssetFromCatalogProps] =
    useRemoveAssetsToCatalogMutation();
  const isRemoveAssetLoading = removeAssetFromCatalogProps.isLoading;
  const handleRemoveAsset = async (pricingId: string) => {
    try {
      const res = await removeAssetFromCatalog({
        asset_pricing_ids: [pricingId],
        catalogId: catalog?.id!,
        companyId: companyId!,
      });

      const success = res.data?.success;
      if (success) {
        displaySuccessMessage(`Item have been removed`);
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to remove item from catalog");
    }
  };

  const [addAssetsToCatalog, addAssetsToCatalogProps] =
    useAddAssetsToCatalogMutation();
  const catalogAssetsIds =
    catalogAssets?.map((asset) => asset.asset_pricing.id) ?? [];
  const isAddAssetsLoading = addAssetsToCatalogProps.isLoading;

  const handleAddAssets = async (assetPriceId: string) => {
    await addAssetsToCatalog({
      companyId: companyId!,
      catalogId: catalog?.id!,
      asset_pricing_ids: [...catalogAssetsIds, assetPriceId],
    })
      .unwrap()
      .then((res) => {
        displaySuccessMessage(`Item has been added`);
      })
      .catch((err) => {
        handleUnexpectedAsyncError(err, "Unable to add item to catalog");
      });
  };

  return {
    lowerBoundaryTotal,
    upperBoundaryTotal,
    totalAssetAmountRange,

    handleRemoveAsset,
    isRemoveAssetLoading,

    handleAddAssets,
    isAddAssetsLoading,
  };
};

export default useCatalog;
