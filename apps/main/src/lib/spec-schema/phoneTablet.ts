import type { SpecSchemaEntry } from "./types";

export const phoneTabletSchema: SpecSchemaEntry = {
  assetTypeId: "phone_tablet",
  label: "Phone / Tablet",
  sections: [
    {
      id: "device_subtype",
      title: "Device Type",
      fields: [
        {
          id: "device_subtype",
          label: "Device Subtype",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "smartphone", label: "Smartphone" },
            { id: "tablet", label: "Tablet" },
            { id: "convertible", label: "2-in-1 Tablet" },
          ],
        },
      ],
    },
    {
      id: "display",
      title: "Display",
      fields: [
        {
          id: "screen_size_in",
          label: "Screen Size",
          unit: "inches",
          kind: "select",
          requiredForVendor: true,
          allowOther: true,
          options: [
            "5.5",
            "6.1",
            "6.4",
            "6.7",
            "6.9",
            "7.9",
            "8.3",
            "10.2",
            "10.9",
            "11",
            "12.9",
            "13",
          ].map((v) => ({ id: v, label: `${v}"` })),
        },
        {
          id: "resolution",
          label: "Resolution",
          kind: "combobox",
          allowOther: true,
          options: [
            { id: "hd_plus", label: "HD+" },
            { id: "fhd_plus", label: "FHD+" },
            { id: "qhd_plus", label: "QHD+" },
            { id: "retina", label: "Retina" },
            { id: "liquid_retina", label: "Liquid Retina" },
          ],
        },
        {
          id: "refresh_rate_hz",
          label: "Refresh Rate",
          unit: "Hz",
          kind: "select",
          options: ["60", "90", "120", "144"].map((v) => ({
            id: v,
            label: `${v} Hz`,
          })),
        },
      ],
    },
    {
      id: "performance",
      title: "Performance & Storage",
      fields: [
        {
          id: "processor",
          label: "Processor",
          kind: "combobox",
          requiredForVendor: true,
          allowOther: true,
          options: [
            { id: "apple_a", label: "Apple A-series" },
            { id: "apple_m", label: "Apple M-series" },
            { id: "snapdragon_8", label: "Snapdragon 8" },
            { id: "dimensity", label: "MediaTek Dimensity" },
            { id: "exynos", label: "Samsung Exynos" },
          ],
        },
        {
          id: "ram_gb",
          label: "RAM",
          unit: "GB",
          kind: "select",
          requiredForVendor: true,
          options: ["4", "6", "8", "12", "16"].map((v) => ({
            id: v,
            label: `${v} GB`,
          })),
        },
        {
          id: "storage_capacity",
          label: "Storage",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "64", label: "64 GB" },
            { id: "128", label: "128 GB" },
            { id: "256", label: "256 GB" },
            { id: "512", label: "512 GB" },
            { id: "1024", label: "1 TB" },
          ],
        },
        {
          id: "expandable_storage",
          label: "Expandable Storage",
          kind: "select",
          options: [
            { id: "microsd", label: "Yes (MicroSD)" },
            { id: "no", label: "No" },
          ],
        },
      ],
    },
    {
      id: "platform",
      title: "Platform & Connectivity",
      fields: [
        {
          id: "operating_system",
          label: "Operating System",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "ios", label: "iOS / iPadOS" },
            { id: "android", label: "Android" },
            { id: "windows", label: "Windows" },
          ],
        },
        {
          id: "sim_type",
          label: "SIM Type",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "physical", label: "Physical SIM" },
            { id: "esim", label: "eSIM" },
            { id: "dual_sim", label: "Dual SIM" },
            { id: "dual_esim", label: "Dual eSIM" },
          ],
        },
        {
          id: "cellular",
          label: "Cellular",
          kind: "multiSelect",
          options: [
            { id: "lte", label: "4G / LTE" },
            { id: "5g", label: "5G" },
          ],
        },
      ],
    },
  ],
};
