import type { CatalogKit, KitItem } from "./types";

export const laptopMacbook: KitItem = {
  id: "item-laptop-macbook",
  name: 'MacBook Pro 14" M3 Pro',
  category: "Laptop",
  quantity: 1,
  unitPrice: 2399,
  imageTone: "bg-blue-50 text-blue-700",
};

export const laptopLenovo: KitItem = {
  id: "item-laptop-lenovo",
  name: "Lenovo ThinkPad X1 Carbon Gen 11",
  category: "Laptop",
  quantity: 1,
  unitPrice: 1899,
  imageTone: "bg-gray-100 text-gray-700",
};

export const laptopDell: KitItem = {
  id: "item-laptop-dell",
  name: "Dell XPS 15",
  category: "Laptop",
  quantity: 1,
  unitPrice: 1799,
  imageTone: "bg-sky-50 text-sky-700",
};

export const monitorLg: KitItem = {
  id: "item-monitor-lg",
  name: 'LG 27" 4K UltraFine',
  category: "Monitor",
  quantity: 1,
  unitPrice: 649,
  imageTone: "bg-purple-50 text-purple-700",
};

export const monitorDell: KitItem = {
  id: "item-monitor-dell",
  name: 'Dell UltraSharp 27" U2723QE',
  category: "Monitor",
  quantity: 1,
  unitPrice: 749,
  imageTone: "bg-indigo-50 text-indigo-700",
};

export const monitorSamsung: KitItem = {
  id: "item-monitor-samsung",
  name: 'Samsung 32" Smart Monitor M8',
  category: "Monitor",
  quantity: 1,
  unitPrice: 599,
  imageTone: "bg-violet-50 text-violet-700",
};

export const mouseLogitech: KitItem = {
  id: "item-mouse-logitech",
  name: "Logitech MX Master 3S",
  category: "Accessory",
  quantity: 1,
  unitPrice: 99,
  imageTone: "bg-orange-50 text-orange-700",
};

export const headphonesSony: KitItem = {
  id: "item-headphones-sony",
  name: "Sony WH-1000XM5",
  category: "Accessory",
  quantity: 1,
  unitPrice: 379,
  imageTone: "bg-rose-50 text-rose-700",
};

export const airpods: KitItem = {
  id: "item-earpods-airpods",
  name: "Apple AirPods Pro (2nd Gen)",
  category: "Accessory",
  quantity: 1,
  unitPrice: 249,
  imageTone: "bg-green-50 text-green-700",
};

export const chargerAnker: KitItem = {
  id: "item-charger-anker",
  name: "Anker 100W GaN Fast Charger",
  category: "Accessory",
  quantity: 1,
  unitPrice: 79,
  imageTone: "bg-yellow-50 text-yellow-700",
};

export const totalOf = (items: KitItem[]) =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const catalogKits: CatalogKit[] = [
  {
    id: "kit-1",
    name: "Engineering Starter Kit",
    description: "High-performance workstation kit for senior engineers.",
    status: "ACTIVE",
    items: [laptopMacbook, monitorLg, mouseLogitech, chargerAnker],
    totalCost: totalOf([laptopMacbook, monitorLg, mouseLogitech, chargerAnker]),
  },
  {
    id: "kit-2",
    name: "Remote Essentials Kit",
    description: "Standard laptop, monitor, and accessories for remote teams.",
    status: "ACTIVE",
    items: [laptopLenovo, monitorDell, mouseLogitech, airpods],
    totalCost: totalOf([laptopLenovo, monitorDell, mouseLogitech, airpods]),
  },
  {
    id: "kit-3",
    name: "Design Studio Kit",
    description: "Creative setup with premium display and audio accessories.",
    status: "ACTIVE",
    items: [laptopMacbook, monitorSamsung, headphonesSony, chargerAnker],
    totalCost: totalOf([
      laptopMacbook,
      monitorSamsung,
      headphonesSony,
      chargerAnker,
    ]),
  },
  {
    id: "kit-4",
    name: "Field Operations Kit",
    description: "Durable device package for operations and field teams.",
    status: "ACTIVE",
    items: [laptopDell, monitorLg, mouseLogitech],
    totalCost: totalOf([laptopDell, monitorLg, mouseLogitech]),
  },
];
