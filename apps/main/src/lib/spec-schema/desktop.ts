import type { SpecSchemaEntry } from "./types";

export const desktopSchema: SpecSchemaEntry = {
  assetTypeId: "desktop",
  label: "Desktop / All-in-One",
  sections: [
    {
      id: "form_factor",
      title: "Form Factor",
      fields: [
        {
          id: "form_factor",
          label: "Form Factor",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "tower", label: "Tower" },
            { id: "mini", label: "Mini PC" },
            { id: "aio", label: "All-in-One" },
            { id: "stick", label: "Stick PC" },
            { id: "rack", label: "Rack Mount" },
          ],
        },
      ],
    },
    {
      id: "performance",
      title: "Performance",
      fields: [
        {
          id: "cpu_brand",
          label: "CPU Brand",
          kind: "select",
          requiredForVendor: true,
          allowOther: true,
          options: [
            { id: "intel", label: "Intel" },
            { id: "amd", label: "AMD" },
            { id: "apple", label: "Apple" },
          ],
        },
        {
          id: "cpu_family",
          label: "CPU Family",
          kind: "text",
          requiredForVendor: true,
          placeholder: "e.g. Intel Core i7, Ryzen 7 7700X",
        },
        {
          id: "ram_gb",
          label: "RAM",
          unit: "GB",
          kind: "select",
          requiredForVendor: true,
          allowOther: true,
          options: ["4", "8", "16", "32", "64", "128", "256", "512"].map(
            (v) => ({ id: v, label: `${v} GB` }),
          ),
        },
        {
          id: "storage_capacity",
          label: "Storage",
          kind: "select",
          requiredForVendor: true,
          allowOther: true,
          options: [
            { id: "128", label: "128 GB" },
            { id: "256", label: "256 GB" },
            { id: "512", label: "512 GB" },
            { id: "1024", label: "1 TB" },
            { id: "2048", label: "2 TB" },
            { id: "4096", label: "4 TB" },
            { id: "8192", label: "8 TB+" },
          ],
        },
        {
          id: "storage_type",
          label: "Storage Type",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "ssd_nvme", label: "SSD (NVMe)" },
            { id: "ssd_sata", label: "SSD (SATA)" },
            { id: "hdd", label: "HDD" },
            { id: "hybrid", label: "Hybrid (SSD + HDD)" },
          ],
        },
        {
          id: "gpu_type",
          label: "GPU Type",
          kind: "select",
          options: [
            { id: "integrated", label: "Integrated" },
            { id: "dedicated", label: "Dedicated" },
          ],
        },
        {
          id: "gpu_model",
          label: "GPU Model",
          kind: "text",
          placeholder: "e.g. NVIDIA RTX 4070",
        },
      ],
    },
    {
      id: "power_os",
      title: "Power & OS",
      fields: [
        {
          id: "psu_wattage",
          label: "PSU Wattage",
          unit: "W",
          kind: "select",
          options: [
            { id: "300", label: "Up to 300W" },
            { id: "500", label: "300–500W" },
            { id: "750", label: "500–750W" },
            { id: "1000", label: "750W–1000W" },
            { id: "1000_plus", label: "1000W+" },
          ],
        },
        {
          id: "psu_included",
          label: "PSU Included",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
        },
        {
          id: "operating_system",
          label: "Operating System",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "win11_home", label: "Windows 11 Home" },
            { id: "win11_pro", label: "Windows 11 Pro" },
            { id: "macos", label: "macOS" },
            { id: "linux", label: "Linux" },
            { id: "none", label: "No OS" },
          ],
        },
      ],
    },
  ],
};
