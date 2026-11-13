import type { SpecSubtype } from "../types";

const osCompatibility = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "chromeos", label: "ChromeOS" },
];

export const mouseSubtype: SpecSubtype = {
  id: "mouse",
  label: "Mouse",
  sections: [
    {
      id: "mouse",
      title: "Mouse",
      fields: [
        {
          id: "connection_type",
          label: "Connection Type",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "wired_usb_a", label: "Wired (USB-A)" },
            { id: "wired_usb_c", label: "Wired (USB-C)" },
            { id: "wireless_dongle", label: "Wireless 2.4 GHz dongle" },
            { id: "bluetooth", label: "Bluetooth" },
            { id: "multi_device", label: "Multi-device (dongle + BT)" },
          ],
        },
        {
          id: "ergonomic_type",
          label: "Ergonomic Type",
          kind: "select",
          options: [
            { id: "ambidextrous", label: "Ambidextrous" },
            { id: "right", label: "Right-handed" },
            { id: "left", label: "Left-handed" },
            { id: "vertical", label: "Vertical" },
          ],
        },
        {
          id: "buttons",
          label: "Number of Buttons",
          kind: "select",
          options: ["2", "3", "4", "5", "6", "7"].map((v) => ({
            id: v,
            label: v,
          })),
        },
        {
          id: "dpi_range",
          label: "DPI Range",
          kind: "text",
          placeholder: "e.g. 400–4000 DPI",
        },
        {
          id: "os_compatibility",
          label: "OS Compatibility",
          kind: "multiSelect",
          requiredForVendor: true,
          options: osCompatibility,
        },
      ],
    },
  ],
};
