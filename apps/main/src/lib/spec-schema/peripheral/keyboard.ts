import { keyboardLanguageOptions } from "../laptop/inputPhysical";
import type { SpecSubtype } from "../types";

export const keyboardSubtype: SpecSubtype = {
  id: "keyboard",
  label: "Keyboard",
  sections: [
    {
      id: "keyboard",
      title: "Keyboard",
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
            { id: "multi_device", label: "Multi-device" },
          ],
        },
        {
          id: "keyboard_language",
          label: "Keyboard Language",
          kind: "combobox",
          requiredForVendor: true,
          allowOther: true,
          options: keyboardLanguageOptions,
        },
        {
          id: "keyboard_layout_size",
          label: "Layout / Size",
          kind: "select",
          options: [
            { id: "full", label: "Full-size (with numpad)" },
            { id: "tkl", label: "Tenkeyless (TKL)" },
            { id: "75", label: "75%" },
            { id: "65", label: "65%" },
            { id: "60", label: "60%" },
            { id: "compact", label: "Compact" },
          ],
        },
        {
          id: "switch_type",
          label: "Switch Type",
          kind: "select",
          options: [
            { id: "membrane", label: "Membrane" },
            { id: "scissor", label: "Scissor" },
            { id: "low_profile_mech", label: "Low-profile Mechanical" },
            { id: "cherry_mx", label: "Mechanical (Cherry MX)" },
            { id: "other_mech", label: "Mechanical (Other)" },
            { id: "butterfly", label: "Butterfly" },
          ],
        },
        {
          id: "keyboard_backlight",
          label: "Backlight",
          kind: "select",
          options: [
            { id: "none", label: "None" },
            { id: "single", label: "Single colour" },
            { id: "rgb", label: "RGB" },
          ],
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
            { id: "ios", label: "iOS / iPadOS" },
            { id: "android", label: "Android" },
          ],
        },
      ],
    },
  ],
};
