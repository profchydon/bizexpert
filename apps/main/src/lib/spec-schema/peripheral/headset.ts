import type { SpecSubtype } from "../types";

export const headsetSubtype: SpecSubtype = {
  id: "headset",
  label: "Headset / Headphones",
  sections: [
    {
      id: "headset",
      title: "Headset / Headphones",
      fields: [
        {
          id: "type",
          label: "Type",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "over_ear", label: "Over-ear" },
            { id: "on_ear", label: "On-ear" },
            { id: "in_ear", label: "In-ear (earbuds)" },
            { id: "neckband", label: "Neckband" },
          ],
        },
        {
          id: "connection",
          label: "Connection",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "wired_3_5", label: "Wired 3.5mm" },
            { id: "wired_usb_a", label: "Wired USB-A" },
            { id: "wired_usb_c", label: "Wired USB-C" },
            { id: "bluetooth", label: "Wireless Bluetooth" },
            { id: "wireless_dongle", label: "Wireless 2.4 GHz dongle" },
            { id: "multi_device", label: "Multi-device" },
          ],
        },
        {
          id: "microphone",
          label: "Microphone",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "none", label: "None" },
            { id: "built_in", label: "Built-in" },
            { id: "boom", label: "Detachable boom" },
            { id: "inline", label: "Inline" },
          ],
        },
        {
          id: "noise_cancellation",
          label: "Noise Cancellation",
          kind: "select",
          options: [
            { id: "none", label: "None" },
            { id: "passive", label: "Passive" },
            { id: "anc", label: "Active (ANC)" },
          ],
        },
        {
          id: "certifications",
          label: "Certifications",
          kind: "multiSelect",
          options: [
            { id: "teams", label: "Microsoft Teams Certified" },
            { id: "zoom", label: "Zoom Certified" },
            { id: "google_meet", label: "Google Meet Certified" },
            { id: "uc", label: "UC Certified" },
          ],
        },
        {
          id: "battery_life",
          label: "Battery Life",
          kind: "text",
          placeholder: "e.g. Up to 30 hrs",
        },
        {
          id: "os_compatibility",
          label: "OS Compatibility",
          kind: "multiSelect",
          requiredForVendor: true,
          options: [
            { id: "windows", label: "Windows" },
            { id: "macos", label: "macOS" },
            { id: "linux", label: "Linux" },
            { id: "chromeos", label: "ChromeOS" },
            { id: "ios", label: "iOS" },
            { id: "android", label: "Android" },
          ],
        },
      ],
    },
  ],
};
