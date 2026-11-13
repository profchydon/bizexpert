import type { Grade } from "@/components/application/device-check/types";
import type {
  DeviceType,
  EntrySource,
  StorageStatus,
  WipeStatus,
} from "./storage";

export interface InventoryFilters {
  search: string;
  status: StorageStatus | "all";
  country: string | "all";
  countryId: string | "all";
  source: EntrySource | "all";
  grade: Grade | "all";
  deviceType: DeviceType | "all";
  wipe: WipeStatus | "all";
  grouped: boolean;
  needsAction: boolean;
}

export const INITIAL_FILTERS: InventoryFilters = {
  search: "",
  status: "all",
  country: "all",
  countryId: "all",
  source: "all",
  grade: "all",
  deviceType: "all",
  wipe: "all",
  grouped: false,
  needsAction: false,
};
