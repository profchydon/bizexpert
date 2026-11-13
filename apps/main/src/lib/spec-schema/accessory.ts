import type { SpecSchemaEntry } from "./types";

export const accessorySchema: SpecSchemaEntry = {
  assetTypeId: "accessory",
  label: "Accessory",
  sections: [
    {
      id: "accessory",
      title: "Accessory",
      fields: [
        {
          id: "accessory_category",
          label: "Accessory Category",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "cable", label: "Cable" },
            { id: "power_adapter", label: "Power Adapter" },
            { id: "power_bank", label: "Power Bank" },
            { id: "security_key", label: "Security Key" },
            { id: "bag", label: "Bag / Case" },
            { id: "stand", label: "Stand / Mount" },
            { id: "screen_protector", label: "Screen Protector" },
            { id: "other", label: "Other" },
          ],
        },
        {
          id: "compatible_devices",
          label: "Compatible Devices",
          kind: "multiSelect",
          requiredForVendor: true,
          options: [
            { id: "laptop", label: "Laptop" },
            { id: "desktop", label: "Desktop" },
            { id: "monitor", label: "Monitor" },
            { id: "smartphone", label: "Smartphone" },
            { id: "tablet", label: "Tablet" },
            { id: "universal", label: "Universal" },
          ],
        },
        {
          id: "connection_type",
          label: "Connection Type",
          kind: "multiSelect",
          options: [
            { id: "usb_a", label: "USB-A" },
            { id: "usb_c", label: "USB-C" },
            { id: "tb", label: "USB-C (Thunderbolt)" },
            { id: "lightning", label: "Lightning" },
            { id: "nfc", label: "NFC" },
            { id: "bluetooth", label: "Bluetooth" },
            { id: "hdmi", label: "HDMI" },
            { id: "display_port", label: "DisplayPort" },
            { id: "3_5mm", label: "3.5mm" },
            { id: "proprietary", label: "Proprietary" },
            { id: "na", label: "N/A" },
          ],
        },
        {
          id: "os_compatibility",
          label: "OS / Platform Compatibility",
          kind: "multiSelect",
          options: [
            { id: "windows", label: "Windows" },
            { id: "macos", label: "macOS" },
            { id: "linux", label: "Linux" },
            { id: "chromeos", label: "ChromeOS" },
            { id: "ios", label: "iOS / iPadOS" },
            { id: "android", label: "Android" },
            { id: "universal", label: "Universal" },
          ],
        },
      ],
    },
  ],
};
