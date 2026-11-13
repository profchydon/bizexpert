import type { SpecSection } from "../types";

const portCount = ["0", "1", "2", "3", "4"].map((v) => ({ id: v, label: v }));

export const laptopConnectivitySection: SpecSection = {
  id: "connectivity",
  title: "Ports & Connectivity",
  fields: [
    {
      id: "usb_a_ports",
      label: "USB-A Ports",
      kind: "select",
      options: portCount,
    },
    {
      id: "usb_c_ports",
      label: "USB-C Ports",
      kind: "select",
      options: portCount,
    },
    {
      id: "thunderbolt_ports",
      label: "Thunderbolt Ports",
      kind: "select",
      options: portCount,
    },
    {
      id: "hdmi",
      label: "HDMI",
      kind: "select",
      options: [
        { id: "none", label: "None" },
        { id: "1_4", label: "HDMI 1.4" },
        { id: "2_0", label: "HDMI 2.0" },
        { id: "2_1", label: "HDMI 2.1" },
        { id: "mini", label: "Mini HDMI" },
      ],
    },
    {
      id: "sd_card_slot",
      label: "SD Card Slot",
      kind: "select",
      options: [
        { id: "none", label: "None" },
        { id: "sd", label: "SD" },
        { id: "microsd", label: "MicroSD" },
      ],
    },
    {
      id: "ethernet",
      label: "Ethernet",
      kind: "select",
      options: [
        { id: "none", label: "None" },
        { id: "gigabit", label: "Gigabit Ethernet" },
        { id: "2_5g", label: "2.5 GbE" },
      ],
    },
    {
      id: "wifi",
      label: "Wi-Fi Standard",
      kind: "select",
      options: [
        { id: "wifi5", label: "Wi-Fi 5 (802.11ac)" },
        { id: "wifi6", label: "Wi-Fi 6 (802.11ax)" },
        { id: "wifi6e", label: "Wi-Fi 6E" },
        { id: "wifi7", label: "Wi-Fi 7" },
      ],
    },
    {
      id: "bluetooth",
      label: "Bluetooth",
      kind: "select",
      options: ["4.0", "4.2", "5.0", "5.1", "5.2", "5.3"].map((v) => ({
        id: v,
        label: v,
      })),
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
};
