import type { MarketSlug } from "./marketCatalog";

export type MarketRemoteStore = {
  id: string;
  name: string;
  city: string;
};

export type MarketRemoteProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
};

export type MarketRemoteOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  amount: number;
  status: "new" | "processing" | "fulfilled";
  createdAt: string;
};

const STORES: Record<MarketSlug, MarketRemoteStore[]> = {
  jumia: [
    { id: "jumia-lagos", name: "Jumia Lagos Hub", city: "Lagos" },
    { id: "jumia-abuja", name: "Jumia Abuja Hub", city: "Abuja" },
  ],
  konga: [
    { id: "konga-ikeja", name: "Konga Ikeja", city: "Lagos" },
    { id: "konga-ph", name: "Konga Port Harcourt", city: "Port Harcourt" },
  ],
  jiji: [
    { id: "jiji-mainland", name: "Jiji Lagos Mainland", city: "Lagos" },
    { id: "jiji-ibadan", name: "Jiji Ibadan", city: "Ibadan" },
  ],
};

const PRODUCTS: Record<MarketSlug, MarketRemoteProduct[]> = {
  jumia: [
    { id: "jp-1", name: "Samsung Galaxy A15", sku: "JM-A15", price: 185000 },
    { id: "jp-2", name: "Indomie Chicken 70g", sku: "JM-IND70", price: 180 },
    { id: "jp-3", name: "Oraimo Power Bank 20k", sku: "JM-OR20", price: 18500 },
  ],
  konga: [
    {
      id: "kp-1",
      name: "Hisense 43-inch LED TV",
      sku: "KG-TV43",
      price: 245000,
    },
    { id: "kp-2", name: "Peak Milk 400g", sku: "KG-PK400", price: 3200 },
  ],
  jiji: [
    { id: "jj-1", name: "Used Office Chair", sku: "JJ-CHR1", price: 35000 },
    { id: "jj-2", name: "iPhone 12 128GB", sku: "JJ-IP12", price: 310000 },
  ],
};

const ORDERS: Record<MarketSlug, MarketRemoteOrder[]> = {
  jumia: [
    {
      id: "jo-1",
      orderNumber: "JM-10482",
      productName: "Samsung Galaxy A15",
      amount: 185000,
      status: "new",
      createdAt: "2026-10-28T10:12:00.000Z",
    },
    {
      id: "jo-2",
      orderNumber: "JM-10461",
      productName: "Indomie Chicken 70g",
      amount: 1800,
      status: "fulfilled",
      createdAt: "2026-10-26T16:40:00.000Z",
    },
  ],
  konga: [
    {
      id: "ko-1",
      orderNumber: "KG-2291",
      productName: "Peak Milk 400g",
      amount: 6400,
      status: "processing",
      createdAt: "2026-10-29T08:05:00.000Z",
    },
  ],
  jiji: [
    {
      id: "jj-o1",
      orderNumber: "JJ-8831",
      productName: "Used Office Chair",
      amount: 35000,
      status: "new",
      createdAt: "2026-10-30T12:22:00.000Z",
    },
  ],
};

export function remoteStoresFor(slug: MarketSlug): MarketRemoteStore[] {
  return STORES[slug];
}

export function remoteProductsFor(slug: MarketSlug): MarketRemoteProduct[] {
  return PRODUCTS[slug];
}

export function remoteOrdersFor(slug: MarketSlug): MarketRemoteOrder[] {
  return ORDERS[slug];
}

export function dummyWebhookUrl(slug: MarketSlug, businessId: string): string {
  return `https://api.bizexpert.local/webhooks/markets/${slug}/${businessId}`;
}
