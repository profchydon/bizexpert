import type { SpecSchemaEntry } from "../types";
import { laptopBatterySection } from "./battery";
import { laptopConnectivitySection } from "./connectivity";
import { laptopDisplaySection } from "./display";
import { laptopInputPhysicalSection } from "./inputPhysical";
import { laptopPerformanceSection } from "./performance";

export const laptopSchema: SpecSchemaEntry = {
  assetTypeId: "laptop",
  label: "Laptop",
  sections: [
    laptopPerformanceSection,
    laptopDisplaySection,
    laptopBatterySection,
    laptopConnectivitySection,
    laptopInputPhysicalSection,
  ],
};
