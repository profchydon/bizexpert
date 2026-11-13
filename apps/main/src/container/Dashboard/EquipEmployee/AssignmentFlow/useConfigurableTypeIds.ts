import { useMemo } from "react";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { configurableTypeIds } from "./deviceSetup";

export const useConfigurableTypeIds = (): Set<string> => {
  const { data } = useGetAssetTypesQuery();
  return useMemo(() => configurableTypeIds(data?.data), [data]);
};
