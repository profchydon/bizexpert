import { accessorySchema } from "./accessory";
import { desktopSchema } from "./desktop";
import { laptopSchema } from "./laptop";
import { monitorSchema } from "./monitor";
import { peripheralSchema } from "./peripheral";
import { phoneTabletSchema } from "./phoneTablet";
import type { SpecSchemaEntry, SpecSection } from "./types";
import { universalSection } from "./universal";

const REGISTRY: Record<string, SpecSchemaEntry> = {
  [laptopSchema.assetTypeId]: laptopSchema,
  [desktopSchema.assetTypeId]: desktopSchema,
  [monitorSchema.assetTypeId]: monitorSchema,
  [phoneTabletSchema.assetTypeId]: phoneTabletSchema,
  [peripheralSchema.assetTypeId]: peripheralSchema,
  [accessorySchema.assetTypeId]: accessorySchema,
};

export function getSchemaFor(
  schemaId: string | null | undefined,
): SpecSchemaEntry | null {
  if (!schemaId) return null;
  return REGISTRY[schemaId] ?? null;
}

export function getUniversalSection(): SpecSection {
  return universalSection;
}

export function getAllSchemaIds(): string[] {
  return Object.keys(REGISTRY);
}
