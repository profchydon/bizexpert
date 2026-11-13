import type { OfficeAsset } from "../types/officeAsset";

type AssignedAssetFields = Pick<OfficeAsset, "assigneeId" | "assigneeName">;

export function isOfficeAssetAssigned(asset: AssignedAssetFields): boolean {
  return Boolean(asset.assigneeId.trim() || asset.assigneeName.trim());
}

export function hasAssignedOfficeAssets(
  assets: AssignedAssetFields[],
): boolean {
  return assets.some(isOfficeAssetAssigned);
}
