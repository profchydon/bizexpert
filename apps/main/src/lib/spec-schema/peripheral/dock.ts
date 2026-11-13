import type { SpecSubtype } from "../types";

const portCount = ["0", "1", "2", "3", "4"].map((v) => ({ id: v, label: v }));

export const dockSubtype: SpecSubtype = {
  id: "dock",
  label: "Docking Station / Hub",
  sections: [
    {
      id: "dock",
      title: "Docking Station / Hub",
      fields: [
        {
          id: "connection_to_host",
          label: "Connection to Host",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "usb_a", label: "USB-A" },
            { id: "usb_c", label: "USB-C" },
            { id: "tb3", label: "Thunderbolt 3" },
            { id: "tb4", label: "Thunderbolt 4" },
          ],
        },
        {
          id: "power_delivery_w",
          label: "Power Delivery to Laptop",
          unit: "W",
          kind: "select",
          requiredForVendor: true,
          options: [
            { id: "none", label: "None" },
            { id: "45", label: "45W" },
            { id: "65", label: "65W" },
            { id: "85", label: "85W" },
            { id: "96", label: "96W" },
            { id: "100", label: "100W" },
          ],
        },
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
          id: "hdmi_ports",
          label: "HDMI Ports",
          kind: "select",
          options: portCount,
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
          id: "form_factor",
          label: "Form Factor",
          kind: "select",
          options: [
            { id: "desktop_pro", label: "Desktop / Pro" },
            { id: "portable", label: "Portable / Travel" },
          ],
        },
      ],
    },
  ],
};
