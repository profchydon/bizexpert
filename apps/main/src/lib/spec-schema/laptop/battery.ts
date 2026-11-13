import type { SpecSection } from "../types";

export const laptopBatterySection: SpecSection = {
  id: "battery_power",
  title: "Battery & Power",
  fields: [
    {
      id: "battery_life_hours",
      label: "Battery Life (claimed)",
      kind: "select",
      options: [
        { id: "6", label: "Up to 6 hrs" },
        { id: "8", label: "Up to 8 hrs" },
        { id: "10", label: "Up to 10 hrs" },
        { id: "12", label: "Up to 12 hrs" },
        { id: "15", label: "Up to 15 hrs" },
        { id: "15_plus", label: "15+ hrs" },
      ],
    },
    {
      id: "charging_standard",
      label: "Charging Standard",
      kind: "select",
      requiredForVendor: true,
      allowOther: true,
      options: [
        { id: "usb_c_pd", label: "USB-C PD" },
        { id: "magsafe3", label: "MagSafe 3" },
        { id: "magsafe1_2", label: "MagSafe 1/2" },
        { id: "barrel", label: "Barrel Connector" },
        { id: "dell_slim", label: "Dell Slim Tip" },
        { id: "surface_connect", label: "Surface Connect" },
      ],
    },
    {
      id: "adapter_wattage",
      label: "Adapter Wattage",
      unit: "W",
      kind: "select",
      requiredForVendor: true,
      allowOther: true,
      options: [
        "30",
        "45",
        "60",
        "65",
        "85",
        "96",
        "100",
        "120",
        "140",
        "200",
      ].map((v) => ({ id: v, label: `${v}W` })),
    },
  ],
};
