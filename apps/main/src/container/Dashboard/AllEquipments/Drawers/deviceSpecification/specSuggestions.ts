import {
  DEVICE_SPEC_OPTIONS,
  DEVICE_SPEC_VALUE_OPTIONS,
} from "./deviceSpecificationOptions";

export interface SpecSuggestion {
  id: string;
  label: string;
}

const FREE_TEXT_SUGGESTIONS: Record<string, string> = {
  processor:
    "Apple M1, Apple M1 Pro, Apple M1 Max, Apple M1 Ultra, Apple M2, Apple M2 Pro, Apple M2 Max, Apple M2 Ultra, Apple M3, Apple M3 Pro, Apple M3 Max, Apple M4, Apple M4 Pro, Apple M4 Max, Intel Core i3, Intel Core i5, Intel Core i7, Intel Core i9, Intel Core Ultra 5, Intel Core Ultra 7, Intel Core Ultra 9, Intel Xeon, AMD Ryzen 3, AMD Ryzen 5, AMD Ryzen 7, AMD Ryzen 9, AMD Ryzen AI 9, AMD Threadripper, Snapdragon X Elite, Snapdragon X Plus, Snapdragon 8 Gen 3, Apple A18 Pro, Apple A17 Pro, Apple A16 Bionic, MediaTek Dimensity 9300, Google Tensor G4",
  ram: "4GB RAM, 8GB RAM, 12GB RAM, 16GB RAM, 18GB RAM, 24GB RAM, 32GB RAM, 36GB RAM, 48GB RAM, 64GB RAM, 96GB RAM, 128GB RAM, 192GB RAM, 256GB RAM",
  storage:
    "64GB eMMC, 128GB SSD, 256GB SSD, 512GB SSD, 1TB SSD, 2TB SSD, 4TB SSD, 8TB SSD, 500GB HDD, 1TB HDD, 2TB HDD, 4TB HDD, 128GB UFS, 256GB UFS, 512GB UFS, 1TB UFS",
  graphics:
    "Integrated graphics, Intel Iris Xe, Intel UHD Graphics, Intel Arc, Apple GPU, AMD Radeon, AMD Radeon RX 7600, AMD Radeon RX 7900 XT, NVIDIA RTX 3050, NVIDIA RTX 4050, NVIDIA RTX 4060, NVIDIA RTX 4070, NVIDIA RTX 4080, NVIDIA RTX 4090, NVIDIA RTX A2000, NVIDIA RTX 6000 Ada",
  display:
    '11" Liquid Retina, 13.6" Liquid Retina, 14" Liquid Retina XDR, 15.3" Liquid Retina, 16" Liquid Retina XDR, OLED, AMOLED, IPS LCD, Mini-LED, Retina display, Super Retina XDR, Dynamic AMOLED 2X, PLS LCD, TN, VA',
  "screen-size":
    '5.4", 6.1", 6.7", 7.9", 8.3", 10.2", 10.9", 11", 12.9", 13", 13.3", 13.6", 14", 15", 15.6", 16", 17", 21.5", 24", 27", 32", 34", 38", 43", 49", 55", 65", 75", 85"',
  resolution:
    "1280×720 (HD), 1920×1080 (FHD), 2160×1440, 2560×1440 (QHD), 2560×1600, 2880×1800, 3000×2000, 3024×1964, 3456×2234, 3840×2160 (4K UHD), 5120×2880 (5K), 6016×3384 (6K), 7680×4320 (8K), 2532×1170, 2796×1290, 2778×1284",
  "refresh-rate":
    "30Hz, 48Hz, 60Hz, 75Hz, 90Hz, 100Hz, 120Hz, 144Hz, 165Hz, 175Hz, 180Hz, 200Hz, 240Hz, 280Hz, 360Hz, 500Hz, ProMotion 120Hz",
  "panel-type":
    "IPS, IPS LCD, OLED, AMOLED, Super AMOLED, Dynamic AMOLED 2X, VA, TN, Mini-LED, Micro-LED, PLS, Nano IPS, QD-OLED, Liquid Retina XDR",
  brightness:
    "200 nits, 250 nits, 300 nits, 350 nits, 400 nits, 450 nits, 500 nits, 600 nits, 800 nits, 1000 nits, 1200 nits, 1600 nits, 2000 nits (peak), HDR400, HDR600, HDR1000",
  "aspect-ratio":
    "4:3, 3:2, 5:4, 16:10, 16:9, 21:9, 32:9, 18:9, 19.5:9, 20:9, 1:1",
  battery:
    "Up to 8 hours, Up to 10 hours, Up to 12 hours, Up to 15 hours, Up to 17 hours, Up to 18 hours, Up to 20 hours, Up to 22 hours, 3000mAh, 3500mAh, 4000mAh, 4500mAh, 5000mAh, 6000mAh, 40Wh, 50Wh, 60Wh, 70Wh, 80Wh, 99.6Wh",
  os: "macOS, macOS Sonoma, macOS Sequoia, Windows 11 Pro, Windows 11 Home, Windows 11 Enterprise, Windows 10 Pro, ChromeOS, Linux (Ubuntu), iOS, iPadOS, Android 14, Android 15, watchOS, No OS (FreeDOS)",
  camera:
    "5MP, 8MP, 12MP, 12MP webcam, 1080p FHD webcam, 720p HD webcam, 4K webcam, 48MP main, 50MP main, 108MP main, 200MP main, Dual camera, Triple camera, Quad camera, Ultra-wide, Telephoto, TrueDepth front camera",
  network:
    "Wi-Fi only, 4G LTE, LTE Advanced, 5G, 5G mmWave, 5G Sub-6, Cellular + GPS, eSIM cellular",
  sim: "Nano-SIM, Dual Nano-SIM, eSIM, Dual eSIM, Nano-SIM + eSIM, Micro-SIM, Embedded SIM",
  connectivity:
    "Wi-Fi 5 (802.11ac), Wi-Fi 6 (802.11ax), Wi-Fi 6E, Wi-Fi 7, Bluetooth 5.0, Bluetooth 5.1, Bluetooth 5.2, Bluetooth 5.3, Bluetooth 5.4, USB-C, USB-A, Thunderbolt 3, Thunderbolt 4, Thunderbolt 5, NFC, Ethernet, Cellular, GPS, UWB, Wired, Wireless 2.4GHz",
  ports:
    "USB-C, USB-A, USB4, Thunderbolt 3, Thunderbolt 4, Thunderbolt 5, HDMI 2.0, HDMI 2.1, DisplayPort, Mini DisplayPort, VGA, Ethernet (RJ45), 3.5mm audio jack, SD card, microSD, MagSafe, Lightning, Optical audio, DC-in",
  "wifi-standard":
    "Wi-Fi 4 (802.11n), Wi-Fi 5 (802.11ac), Wi-Fi 6 (802.11ax), Wi-Fi 6E, Wi-Fi 7 (802.11be)",
  throughput:
    "100 Mbps, 1 Gbps, 2.5 Gbps, 5 Gbps, 10 Gbps, 25 Gbps, 40 Gbps, 1.2 Gbps, 3.0 Gbps, 5.4 Gbps, 9.6 Gbps, 11 Gbps, 46 Gbps",
  poe: "No PoE, PoE (802.3af), PoE+ (802.3at), PoE++ (802.3bt), Passive PoE, PoE pass-through",
  "rack-units": "Desktop, Wall-mount, 1U, 2U, 3U, 4U, 5U, Half-width 1U",
  "audio-output":
    "Mono, Stereo, 2.0, 2.1, 5.1 surround, 7.1 surround, 3W, 5W, 10W, 16W, 20W, 40W, Dolby Atmos, Spatial Audio, Hi-Res Audio",
  "driver-size":
    "6mm, 8mm, 10mm, 11mm, 12mm, 14.2mm, 40mm, 50mm, 53mm, Dual driver, Planar magnetic",
  microphone:
    "Built-in, Single mic, Dual mic, Triple-mic array, Quad-mic array, Beamforming, Noise-cancelling, Studio-quality, Omnidirectional, Cardioid, None",
  "power-delivery":
    "5W, 18W, 20W, 30W, 45W, 60W, 65W, 85W, 96W, 100W, 140W, 240W",
  "max-displays":
    "Single display, Single 4K @ 60Hz, Dual 4K @ 60Hz, Dual 1080p, Triple display, Up to 2 displays, Up to 3 displays, Up to 4 displays, 6K @ 60Hz, 8K @ 60Hz",
  capacity:
    "350VA, 500VA, 650VA, 850VA, 1000VA, 1200VA, 1500VA, 2200VA, 3000VA, 5000VA, 6000VA, 10000VA",
  "output-power":
    "200W, 280W, 360W, 420W, 510W, 600W, 700W, 900W, 1000W, 1350W, 1500W, 1980W, 2700W",
  "battery-type":
    "Lithium-ion, Lithium-polymer, LiFePO4, Lead-acid (VRLA), Sealed lead-acid (SLA), AGM, NiMH",
  outlets:
    "2 outlets, 4 outlets, 6 outlets, 8 outlets, 10 outlets, 12 outlets, Surge-only outlets, Battery backup outlets, IEC C13, IEC C19",
  runtime:
    "Up to 5 min, Up to 10 min, Up to 15 min, Up to 20 min, Up to 30 min, Up to 45 min, Up to 60 min, Up to 90 min, Up to 2 hours",
  authentication:
    "PIN, Password, Fingerprint, Touch ID, Face ID, Face recognition, Iris scan, RFID, NFC, Smart card, Physical key, Two-factor (2FA), Biometric, FIDO2 / WebAuthn",
  compatibility:
    "Universal, Cross-platform, Apple / macOS, Windows, Linux, ChromeOS, iOS / iPadOS, Android, USB-C devices, Thunderbolt devices, VESA 75×75, VESA 100×100, Qi wireless, MagSafe",
  dpi: "400 DPI, 800 DPI, 1000 DPI, 1200 DPI, 1600 DPI, 2400 DPI, 3200 DPI, 4000 DPI, 8000 DPI, 16000 DPI, 20000 DPI, 26000 DPI",
  "switch-type":
    "Membrane, Scissor, Mechanical, Optical-mechanical, Hall effect, Linear (Red), Tactile (Brown), Clicky (Blue), Silent, Low-profile, Capacitive",
  layout:
    "Full-size (100%), 1800-compact (96%), Tenkeyless (TKL / 80%), 75%, 65%, 60%, 40%, Numpad, Split / ergonomic, ANSI, ISO, QWERTY, AZERTY, QWERTZ",
  material:
    "Aluminum, Anodized aluminum, Magnesium alloy, Stainless steel, Steel, Titanium, Plastic, Polycarbonate, ABS, Carbon fiber, Glass, Tempered glass, Leather, Vegan leather, Silicone, Fabric / mesh, Recycled aluminum, Wood",
  weight:
    "Under 200g, 250g, Under 500g, Under 1kg, 1.0kg, 1.2kg, 1.24kg, 1.4kg, 1.5kg, 1.6kg, 1.8kg, 2.0kg, 2.1kg, 2.5kg, 3.0kg",
  dimensions:
    "Ultra-compact, Compact, Slim, Standard, Portable, Foldable, Tower, Small form factor (SFF), Mini, Mid-tower, Full-tower",
  colour:
    "Space Black, Space Gray, Midnight, Starlight, Silver, Graphite, Gold, Rose Gold, White, Pearl White, Black, Matte Black, Jet Black, Gray, Blue, Sky Blue, Pacific Blue, Sierra Blue, Navy, Green, Alpine Green, Midnight Green, Red, (PRODUCT)RED, Pink, Purple, Deep Purple, Yellow, Orange, Titanium, Natural Titanium, Blue Titanium, Bronze",
  warranty:
    "90 days, 6 months, 1 year, 1-year limited, 2 years, 3 years, 5 years, AppleCare+, AppleCare+ for Business, Manufacturer warranty, Extended warranty, Lifetime warranty, No warranty",
};

export function isRestrictedSpecKey(key: string): boolean {
  return Boolean(DEVICE_SPEC_VALUE_OPTIONS[key]);
}

export function specSuggestions(key: string): SpecSuggestion[] {
  const restricted = DEVICE_SPEC_VALUE_OPTIONS[key];
  if (restricted) {
    return restricted.map((option) => ({
      id: option.value,
      label: option.label,
    }));
  }
  const raw = FREE_TEXT_SUGGESTIONS[key];
  if (!raw) return [];
  return raw.split(", ").map((value) => ({ id: value, label: value }));
}

export function specTypeLabel(key: string): string {
  const known = DEVICE_SPEC_OPTIONS.find((option) => option.value === key);
  if (known) return known.label;
  if (!key) return "";
  return key.charAt(0).toUpperCase() + key.slice(1);
}
