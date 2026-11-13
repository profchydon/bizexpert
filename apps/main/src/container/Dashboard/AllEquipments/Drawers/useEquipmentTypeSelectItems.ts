import { useEffect } from "react";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { resolveAssetTypeSelectValue } from "./AddEquipment/assetTypeSelect";
import { toEquipmentTypeItems } from "./buildEquipmentSelectItems";

export const useEquipmentTypeSelectItems = (
  current: string,
  onResolve: (value: string) => void,
) => {
  const { data } = useGetAssetTypesQuery();
  const types = data?.data;

  useEffect(() => {
    const resolved = resolveAssetTypeSelectValue(current, types);
    if (resolved && resolved !== current) onResolve(resolved);
  }, [current, onResolve, types]);

  return toEquipmentTypeItems(types);
};
