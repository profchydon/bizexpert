import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { resolveAssetTypeName } from "./resolveAssetTypeName";

export const useResolvedAssetType = (
  type?: string | null,
): string | undefined => {
  const { data } = useGetAssetTypesQuery();
  return resolveAssetTypeName(type, data?.data);
};
