// Additional hardware specifications per seeded device, shown under
// "Specifications" on the device details tab. Model is the first spec row but is
// rendered from the device's canonical `model` field, so it is not repeated here.
// Keyed by device id; devices without an entry (e.g. freshly imported ones) still
// show Model, just none of the extra rows below.
export interface DeviceSpec {
  label: string;
  value: string;
}

export const DEVICE_SPECS: Record<string, DeviceSpec[]> = {
  "STD-1001": [
    { label: "Processor", value: "Apple M3 (8-core)" },
    { label: "Memory", value: "16GB unified" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: '14.2" Liquid Retina XDR' },
  ],
  "STD-1002": [
    { label: "Processor", value: "Intel Core i7-1365U" },
    { label: "Memory", value: "16GB DDR5" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: '14" FHD+' },
  ],
  "STD-1003": [
    { label: "Chip", value: "A17 Pro" },
    { label: "Storage", value: "256GB" },
    { label: "Display", value: '6.1" Super Retina XDR' },
    { label: "Camera", value: "48MP triple" },
  ],
  "STD-1004": [
    { label: "Processor", value: "Intel Core i7-1355U" },
    { label: "Memory", value: "16GB LPDDR5" },
    { label: "Storage", value: "1TB SSD" },
    { label: "Display", value: '14" WUXGA' },
  ],
  "STD-1005": [
    { label: "Panel", value: '27" IPS Black' },
    { label: "Resolution", value: "3840 × 2160 (4K)" },
    { label: "Refresh rate", value: "60Hz" },
    { label: "Ports", value: "USB-C, HDMI, DisplayPort" },
  ],
  "STD-1006": [
    { label: "Processor", value: "Apple M2 (8-core)" },
    { label: "Memory", value: "8GB unified" },
    { label: "Storage", value: "256GB SSD" },
    { label: "Display", value: '13.6" Liquid Retina' },
  ],
  "STD-1007": [
    { label: "Processor", value: "Intel Core i5-1335U" },
    { label: "Memory", value: "16GB DDR5" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: '14" WUXGA' },
  ],
  "STD-1008": [
    { label: "Chip", value: "Apple M4" },
    { label: "Storage", value: "256GB" },
    { label: "Display", value: '11" Ultra Retina XDR' },
    { label: "Connectivity", value: "Wi-Fi 6E" },
  ],
  "STD-1009": [
    { label: "Chip", value: "Snapdragon 8 Gen 3" },
    { label: "Memory", value: "12GB" },
    { label: "Storage", value: "256GB" },
    { label: "Display", value: '6.8" QHD+ AMOLED' },
  ],
  "STD-1010": [
    { label: "Processor", value: "Intel Core i5-13500" },
    { label: "Memory", value: "16GB DDR4" },
    { label: "Storage", value: "256GB SSD" },
    { label: "Form factor", value: "Small Form Factor" },
  ],
  "STD-1011": [
    { label: "Type", value: "Wireless keyboard" },
    { label: "Layout", value: "Full-size" },
    { label: "Connectivity", value: "Bluetooth / Logi Bolt" },
    { label: "Battery", value: "Rechargeable (10 days)" },
  ],
  "STD-1012": [
    { label: "Processor", value: "Apple M3 Max (16-core)" },
    { label: "Memory", value: "36GB unified" },
    { label: "Storage", value: "1TB SSD" },
    { label: "Display", value: '16.2" Liquid Retina XDR' },
  ],
  "STD-1013": [
    { label: "Panel", value: '27" IPS' },
    { label: "Resolution", value: "1920 × 1080 (FHD)" },
    { label: "Refresh rate", value: "240Hz" },
    { label: "Ports", value: "HDMI, DisplayPort" },
  ],
  "STD-1014": [
    { label: "Chip", value: "Google Tensor G3" },
    { label: "Memory", value: "12GB" },
    { label: "Storage", value: "128GB" },
    { label: "Display", value: '6.7" LTPO OLED' },
  ],
  "STD-1015": [
    { label: "Processor", value: "Intel Core Ultra 7 155H" },
    { label: "Memory", value: "16GB LPDDR5X" },
    { label: "Storage", value: "1TB SSD" },
    { label: "Display", value: '14" 2.8K OLED' },
  ],
  "STD-1016": [
    { label: "Type", value: "Wireless headset" },
    { label: "Connectivity", value: "Bluetooth / USB-A dongle" },
    { label: "Battery", value: "Up to 37 hours" },
    { label: "Microphone", value: "Noise-isolating boom" },
  ],
  "STD-1017": [
    { label: "Processor", value: "Intel Core i5-1245U" },
    { label: "Memory", value: "16GB DDR5" },
    { label: "Storage", value: "256GB SSD" },
    { label: "Display", value: '13.3" WUXGA' },
  ],
  "STD-1018": [
    { label: "Type", value: "Thunderbolt 4 dock" },
    { label: "Power delivery", value: "130W" },
    { label: "Ports", value: "USB-C, USB-A, HDMI, DP, Ethernet" },
    { label: "Connectivity", value: "Thunderbolt 4" },
  ],
};
