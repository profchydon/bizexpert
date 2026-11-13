import type { SpecSection } from "../types";

export const laptopDisplaySection: SpecSection = {
  id: "display",
  title: "Display & Graphics",
  fields: [
    {
      id: "screen_size_in",
      label: "Screen Size",
      unit: "inches",
      kind: "select",
      requiredForVendor: true,
      allowOther: true,
      options: [
        "11",
        "12",
        "13",
        "13.3",
        "13.6",
        "14",
        "15",
        "15.6",
        "16",
        "17",
        "17.3",
      ].map((v) => ({ id: v, label: `${v}"` })),
    },
    {
      id: "resolution",
      label: "Resolution",
      kind: "combobox",
      requiredForVendor: true,
      allowOther: true,
      options: [
        { id: "hd", label: "HD (1366×768)" },
        { id: "fhd", label: "FHD (1920×1080)" },
        { id: "qhd", label: "QHD (2560×1440)" },
        { id: "uhd4k", label: "4K (3840×2160)" },
        { id: "retina", label: "Retina / Custom" },
      ],
    },
    {
      id: "panel_type",
      label: "Panel Type",
      kind: "select",
      options: [
        { id: "ips", label: "IPS" },
        { id: "tn", label: "TN" },
        { id: "va", label: "VA" },
        { id: "oled", label: "OLED" },
        { id: "amoled", label: "AMOLED" },
        { id: "mini_led", label: "Mini-LED" },
        { id: "liquid_retina", label: "Liquid Retina" },
      ],
    },
    {
      id: "refresh_rate_hz",
      label: "Refresh Rate",
      unit: "Hz",
      kind: "select",
      options: ["60", "90", "120", "144", "165", "240"].map((v) => ({
        id: v,
        label: `${v} Hz`,
      })),
    },
    {
      id: "touchscreen",
      label: "Touchscreen",
      kind: "select",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
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
      placeholder: "e.g. NVIDIA RTX 4060",
    },
  ],
};
