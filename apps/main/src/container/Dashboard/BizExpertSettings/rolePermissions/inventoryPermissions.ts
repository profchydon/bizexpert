import { toPermissions } from "./permissionTypes";
import { INVENTORY_CATALOG_ROWS } from "./inventoryCatalogPermissions";
import { INVENTORY_OPS_ROWS } from "./inventoryOpsPermissions";

export const INVENTORY_PERMISSIONS = toPermissions("Inventory Management", [
  ...INVENTORY_OPS_ROWS,
  ...INVENTORY_CATALOG_ROWS,
]);
