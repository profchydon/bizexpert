import type { FilterTab, RequestFilters } from "./types";

// ── Filter tabs ───────────────────────────────────────────────────────────────
export const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All requests" },
  { id: "pending", label: "Pending" },
  { id: "waiting_for_action", label: "Waiting for Action" },
  { id: "confirmed", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
  { id: "expired", label: "Expired" },
];

// ── Filter option data ────────────────────────────────────────────────────────
export const assetTypes = [
  "Laptop",
  "Monitor",
  "Furniture",
  "Conference",
  "Phone",
  "Audio",
  "Accessory",
  "Peripheral",
  "Tablet",
];

export const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Singapore",
];

export const countryCodeMap: Record<string, string> = {
  "United States": "US",
  Canada: "CA",
  "United Kingdom": "GB",
  Germany: "DE",
  France: "FR",
  Australia: "AU",
  Japan: "JP",
  Singapore: "SG",
};

export const defaultRequestFilters: RequestFilters = {
  countries: [],
  assetTypes: [],
  budgetRange: [0, 100000000],
};

// ── Mock data seeds ───────────────────────────────────────────────────────────
export const alternativeDevices = [
  {
    name: 'MacBook Pro 16" M3 Max',
    price: 3499,
    specs: "M3 Max chip, 36GB RAM, 1TB SSD",
  },
  { name: "Dell XPS 15", price: 1799, specs: "Intel i7, 32GB RAM, 1TB SSD" },
  {
    name: "HP EliteBook 840",
    price: 1599,
    specs: "Intel i7, 16GB RAM, 512GB SSD",
  },
  { name: 'LG 32" UltraFine 4K', price: 699, specs: "4K IPS, USB-C, 32 inch" },
  {
    name: "Samsung Galaxy Tab S9",
    price: 849,
    specs: "Snapdragon, 256GB, WiFi",
  },
];

export const rfqDeviceTemplates = [
  { name: 'MacBook Pro 14" M3 Pro', assetType: "Laptop", basePrice: 1999 },
  { name: "Dell Precision 5680", assetType: "Laptop", basePrice: 3500 },
  { name: "Lenovo ThinkPad X1 Carbon", assetType: "Laptop", basePrice: 1649 },
  { name: 'LG 27UP850-W 27" 4K Monitor', assetType: "Monitor", basePrice: 450 },
  {
    name: 'Dell UltraSharp U3223QE 32"',
    assetType: "Monitor",
    basePrice: 1100,
  },
  { name: 'Samsung 49" Odyssey G9', assetType: "Monitor", basePrice: 1299 },
  {
    name: "Herman Miller Aeron Chair",
    assetType: "Furniture",
    basePrice: 1395,
  },
  {
    name: "Fully Jarvis Standing Desk",
    assetType: "Furniture",
    basePrice: 750,
  },
  { name: "Logitech Rally Bar", assetType: "Conference", basePrice: 2999 },
  { name: "iPhone 15 Pro Max", assetType: "Phone", basePrice: 1199 },
  { name: "Apple AirPods Pro 2", assetType: "Audio", basePrice: 249 },
  {
    name: "CalDigit TS4 Thunderbolt Dock",
    assetType: "Accessory",
    basePrice: 400,
  },
  { name: "Razer BlackWidow V4 Pro", assetType: "Peripheral", basePrice: 230 },
  { name: "Microsoft Surface Pro 9", assetType: "Tablet", basePrice: 1599 },
  {
    name: "BenQ ScreenBar Monitor Light",
    assetType: "Accessory",
    basePrice: 109,
  },
];

export const ITEMS_PER_PAGE = 10;
