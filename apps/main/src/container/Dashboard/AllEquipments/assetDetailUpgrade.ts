import routes from "@/routes";

export function assetDetailUpgradeHref(): string {
  return `${routes.All_Equipments}?assetUpgrade=1`;
}

export function equipmentViewHref(
  detailHref: string,
  assetDetailOn: boolean,
): string {
  return assetDetailOn ? detailHref : assetDetailUpgradeHref();
}
