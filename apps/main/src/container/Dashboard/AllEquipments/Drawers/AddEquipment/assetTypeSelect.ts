export type AssetTypeOption = {
  id: string;
  name: string;
};

export const toAssetTypeOptions = (
  types?: AssetTypeOption[] | null,
): AssetTypeOption[] =>
  (types ?? []).filter((type) => Boolean(type.id && type.name));

export const resolveAssetTypeSelectValue = (
  current: string | undefined,
  types?: AssetTypeOption[] | null,
): string => {
  if (!current) return "";
  const match = types?.find(
    (type) => type.id === current || type.name === current,
  );
  return match?.name ?? current;
};
